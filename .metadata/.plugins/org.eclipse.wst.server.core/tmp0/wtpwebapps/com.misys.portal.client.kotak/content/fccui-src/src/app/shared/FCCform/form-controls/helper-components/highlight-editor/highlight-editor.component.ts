import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SecurityContext,
  Self,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  ControlContainer,
  ControlValueAccessor,
  NgControl,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { PhrasesService } from "../../../../../common/services/phrases.service";
import { FCCFormControl } from "../../../../../base/model/fcc-control.model";
import {
  IEditorData,
  IEditorProperties,
  INodeData,
} from "./highlight-editor.model";
import { HighlightHtmlPipe } from "./highlight-html.pipe";
import { CommonService } from "./../../../../../common/services/common.service";
import { FccGlobalConstant } from "./../../../../../common/core/fcc-global-constants";


export class EditorErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FCCFormControl): boolean {
    return control.dirty && control.invalid;
  }
}
@Component({
  selector: "fcc-highlight-editor",
  templateUrl: "./highlight-editor.component.html",
  styleUrls: ["./highlight-editor.component.scss"],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: HighlightEditorComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: EditorErrorMatcher,
    },
  ],
})
export class HighlightEditorComponent
  implements
  OnInit,
  OnDestroy,
  OnChanges,
  MatFormFieldControl<string>,
  ControlValueAccessor {
  @Input() properties: IEditorProperties = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "1.5rem",
    maxHeight: "auto",
    width: "auto",
    minWidth: "0",
    placeholder: "",
    defaultParagraphSeparator: "",
    sanitize: true,
    outline: false,
    resize: true,
    regex: null,
  };
  @Input() tabIndex: number | null = null;
  @Input() typeOfRegex: string;
  private htmlAsString = "";
  private subject: Subject<void> = new Subject();
  private backspaceSubject: Subject<void> = new Subject();
  private deleteSubject: Subject<void> = new Subject();
  @ViewChild("editor", { static: true }) editorTextArea!: ElementRef;
  @ViewChild("placeholder", { static: true }) placeholderRef!: ElementRef;
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native
  @Output("blur") blurEvent: EventEmitter<IEditorData> =
    new EventEmitter<IEditorData>();
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native
  @Output("focus") focusEvent: EventEmitter<FocusEvent> =
    new EventEmitter<FocusEvent>();
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native
  @Output("click") clickEvent: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
  @Output() data: EventEmitter<IEditorData> = new EventEmitter<IEditorData>();
  @HostBinding("attr.tabindex") tabindex = -1;
  @HostBinding("attr.aria-describedby") describedBy = "";
  static nextId = 0;
  editorValueMap: Map<string, any> = new Map();
  errorCount: number;
  sanitisedHtml: SafeHtml;
  subscriptions: Subscription[] = [];
  touched = false;
  formControlName = "";
  caretPosition = [];
  nodeArray: INodeData[] = [];
  lastIndex = 0;
  previousValue = "";
  isRefreshView = false;
  isBackspace = false;
  textAreaFocus=false;
  highlightApplied: boolean;
  constructor(
    @Attribute("tabindex") defaultTabIndex: string,
    protected highLightHtmlPipe: HighlightHtmlPipe,
    protected sanitizer: DomSanitizer,
    protected renderer: Renderer2,
    protected focusMonitor: FocusMonitor,
    protected controlContainer: ControlContainer,
    protected phrasesService: PhrasesService,
    protected commonService: CommonService,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex =
      parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }
  //ControlValueAccessor implementation
  writeValue(value: string): void {
    // this.textAreaFocus=false;
    this.htmlAsString = value;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: string) => { };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onToutch = () => { };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onToutch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.setDisableProperties(isDisabled);
    this.stateChanges.next();
  }
  setDisableProperties(isDisabled: boolean) {
    const div = this.editorTextArea.nativeElement;
    const action = isDisabled ? "addClass" : "removeClass";
    this.renderer[action](div, "disabled");
    this.properties.editable = !isDisabled;
    this.editorTextArea.nativeElement.style.pointerEvents = "none";
  }
  get control() {
    return this.controlContainer.control?.get(this.formControlName);
  }
  //MatFormFieldControl implementation
  @Input() set value(editorValue: string) {
    this.htmlAsString = editorValue;
    this.stateChanges.next();
  }
  get value(): string {
    return this.htmlAsString;
  }
  stateChanges = new Subject<void>();
  @Input()
  @HostBinding()
  id = `highlight-editor-id-${HighlightEditorComponent.nextId++}`;
  get placeholder(): string {
    return this.properties.placeholder ? this.properties.placeholder : "";
  }
  set placeholder(palceholderData: string) {
    this.properties.placeholder = palceholderData;
    this.stateChanges.next();
  }
  focused = false;
  get empty(): boolean {
    return this.extractTextFromHTML(this.htmlAsString)?.trim().length
      ? false
      : true;
  }
  @HostBinding("class.floating")
  get shouldLabelFloat() {
    return (this.focused || !this.empty) && !this.disabled;
  }
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  public _required = false;
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(req) {
    this._disabled = coerceBooleanProperty(req);
    if (this._disabled) {
      this.setDisableProperties(this._disabled);
    }
    this.stateChanges.next();
  }
  @Input() _disabled = false;
  get errorState(): boolean {
    return this.errorCount > 0 && !this.disabled ? true : false;
  }
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(" ");
  }
  onContainerClick(event: MouseEvent): void {
    // this.textAreaFocus=false
    if (!this.disabled) {
      // this.textAreaFocus=true;
      this.focusMonitor.focusVia(this.editorTextArea, "program");
      this.editorTextArea.nativeElement.focus();
    }
    // this.textAreaFocus=false
    event.stopPropagation();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.firstChange && this.commonService.isNonEmptyValue(this.value)) {
      const illegalCharacters = this.value.match(this.properties.regex);
      if (!(illegalCharacters && illegalCharacters.length)) {
        this.applyHighlight(this.value, true);
      }
      else {
        const flag = this.checkDifference(changes.value.currentValue, changes.value.previousValue);
        if (flag) {
          this.handleSpaceAndBackSpace();
        } else {
          this.applyHighlight(this.htmlAsString);
          this.highlightApplied = true;
        }
      }
    } else {
      const flag = this.checkDifference(changes.value.currentValue, changes.value.previousValue);
      if (flag) {
        this.handleSpaceAndBackSpace();
      } else {
        this.applyHighlight(this.htmlAsString);
      }
    }
    this.refreshView(this.sanitisedHtml as string);
    this.onContentChange();
    this.SetCaretPosition(
      this.editorTextArea.nativeElement,
      this.caretPosition ? this.caretPosition[1] : undefined
    );
  }

  checkDifference(str1: string, str2: string): boolean {
    const cur = str1;
    const pre = str2 ? str2.trimStart(): undefined;
    if (!pre) {
      return false;
    }
    if (cur !== null && cur.length !== null && pre !== null && pre.length !== null){
    if (cur.length > pre.length) {
      return this.getDifference(pre, cur);
    } else {
      return this.getDifference(cur, pre);
    }
    }
  }

  getDifference(s, t) {
    let j = 0;
    const diff = [];
    while (j < s.length) {
      if (s[j] !== t[j]) {
        diff.push(s[j]);
        diff.push(t[j]);
      }
      j++;
      if (diff.indexOf(' ') > -1) {
        return true;
      }
    }
    if (t.length > j) {
      while (j < t.length) {
        diff.push(t[j]);
        j++;
        if (diff.indexOf(' ') > -1) {
          return true;
        }
      }
    }
  }
  ngOnInit() {
    this.subscriptions.push(
      this.subject.pipe(debounceTime(500)).subscribe(() => {
        this.triggerStartProcessing();
      })
    );
    this.subscriptions.push(
      this.backspaceSubject.pipe(debounceTime(100)).subscribe(() => {
        this.triggerStartProcessing('backspace');
      })
    );
    // this.subscriptions.push(
    //   this.deleteSubject.pipe(debounceTime(100)).subscribe(() => {
    //     this.triggerStartProcessing();
    //   })
    // );
    this.subscriptions.push(
      this.focusMonitor.monitor(this.editorTextArea).subscribe((focused) => {
        this.focused = !!focused;
        this.renderer.setStyle(
          this.placeholderRef.nativeElement,
          "display",
          this.empty && this.focused && !this.focused ? "inline-block" : "none"
        );
        this.stateChanges.next();
      })
    );
    this.phrasesService.newPhrasesAdded.subscribe((value) => {
      if (value) {
        this.applyHighlight(this.htmlAsString, true);
        this.refreshView(this.sanitisedHtml as string);
        this.onContentChange();
      }
    });
    // this.applyHighlight(this.extractTextFromHTML(this.htmlAsString));
    // this.refreshView(this.sanitisedHtml as string);
    // this.onContentChange();
    // this.setFocus();
  }
  onKeyUp() {
    this.subject.next();
  }
  onBackspace() {
    this.backspaceSubject.next();
  }
  onDelete() {
    // this.deleteSubject.next();
  }
  extractTextFromHTML(html: string) {
    if (html) {
      return new DOMParser().parseFromString(html, "text/html").documentElement
        .innerText;
    } else {
      return "";
    }
  }
  triggerStartProcessing(code = '') {
    if (code === 'space' || code === 'backspace') {
      this.handleSpaceAndBackSpace();
    } else {
      this.startProcessing();
    }
    this.refreshView(this.sanitisedHtml as string);
    // if (
    //   this.caretPosition[1] ===
    //   this.editorTextArea.nativeElement.innerText.length
    // ) {
    //   this.SetCaretPosition(
    //     this.editorTextArea.nativeElement,
    //     this.caretPosition[1]
    //   );
    // } else {
    this.SetCaretPosition(
      this.editorTextArea.nativeElement,
      this.caretPosition[1]
    );
    // }
  }
  startProcessing(): void {
    let html = "";
    html = this.editorTextArea.nativeElement?.innerHTML;
    let innerText = this.editorTextArea.nativeElement?.innerText;
    if (!html || html === "<br>") {
      innerText = "";
    }
    this.applyHighlight(innerText);
  }
  applyHighlight(htmlValue: string, phraseAdded = false) {
    this.commonService.listenTransmissionMode.subscribe((value) => {
      if (value === FccGlobalConstant.TRANS_MODE_SWIFT) {
        this.properties.showHighlight = true;
      } else {
        this.properties.showHighlight = false;
      }
    });
    this.caretPosition = this.getCaretPosition(
      this.editorTextArea.nativeElement
    );
    const text = this.extractTextFromHTML(htmlValue);
    let htmlContent = "";
    if (this.properties.showHighlight) {
      if (text) {
        const dataForProcessing = this.findNodesForProcessing(text);
        if (
          (this.properties.regex &&
            dataForProcessing.unProcessedStringCurrent.match(
              this.properties.regex
            ) &&
            dataForProcessing.unProcessedStringCurrent.match(
              this.properties.regex
            )?.length !== 0) ||
          (this.properties.regex &&
            dataForProcessing.unProcessedStringPrevious.match(
              this.properties.regex
            ) &&
            dataForProcessing.unProcessedStringPrevious.match(
              this.properties.regex
            )?.length !== 0) ||
          phraseAdded
        ) {
          this.editorValueMap = this.highLightHtmlPipe.transform(
            dataForProcessing.unProcessedStringCurrent,
            this.typeOfRegex,
            dataForProcessing.startNodeIndex,
            dataForProcessing.endNodeIndex,
            this.nodeArray
          );
          htmlContent = `${this.editorValueMap.get("highlightedValue")}`;
          this.nodeArray = this.editorValueMap.get("nodeArray");
          this.previousValue = text;
          this.isRefreshView = true;
        } else {
          this.isRefreshView = false;
          return;
        }
      } else {
        this.editorValueMap.set("highlightedValue", "");
        this.editorValueMap.set("totalErrorCount", "0");
        this.isRefreshView = false;
        htmlContent = ``;
      }
    } else {
      this.editorValueMap.set("highlightedValue", text);
      this.editorValueMap.set("totalErrorCount", "0");
      this.isRefreshView = true;
      htmlContent = `${this.editorValueMap.get("highlightedValue")}`;
    }
    if (this.properties.sanitize) {
      this.sanitisedHtml = this.sanitizer.sanitize(
        SecurityContext.HTML,
        htmlContent
      );
    }
    this.errorCount = parseInt(this.editorValueMap.get("totalErrorCount"), 10);
  }
  refreshView(htmlValue: string): void {
    if (this.isRefreshView) {
      this.htmlAsString = htmlValue === null ? "" : htmlValue;
      this.renderer.setProperty(
        this.editorTextArea.nativeElement,
        "innerHTML",
        this.htmlAsString
      );
    }
  }
  setFocus() {
    const range = document.createRange();
    range.selectNodeContents(this.editorTextArea.nativeElement);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  onContentChange() {
    const html = this.editorTextArea.nativeElement?.innerHTML;
    let innerText = this.editorTextArea.nativeElement?.innerText;
    if (html != '' && !this.focused) {
      innerText = (this.htmlAsString != '') ? this.htmlAsString : innerText;
      innerText=this.commonService.decodeHtml(innerText);
    }
    this.onChange(innerText);
    if (!html || html === "<br>" || html === '<br><span class="no-highlight"></span>') {
      innerText = "";
    }
    if (innerText.length > 0) {
      this.renderer.setStyle(
        this.placeholderRef.nativeElement,
        "display",
        "none"
      );
    } else {
      this.renderer.setStyle(
        this.placeholderRef.nativeElement,
        "display",
        "inline-block"
      );
    }
    if(!this.focused){
    innerText = (this.htmlAsString !== '') ? this.htmlAsString : innerText;
    this.editorTextArea.nativeElement.innerHTML = innerText;
    innerText=this.commonService.decodeHtml(innerText);
    }
    else if(this.htmlAsString !=='' && innerText !== this.htmlAsString){
      this.htmlAsString=innerText;

    }
    this.data.emit({
      html: this.editorTextArea.nativeElement?.innerHTML,
      text: innerText,
      errorCount: this.errorCount,
    });
  }
  onTextAreaFocus(event: FocusEvent): void {
    this.focused = true;
    this.focusEvent.emit(event);
    if (!this.touched) {
      this.touched = true;
    }
    event.stopPropagation();
    this.SetCaretPosition(
     this.editorTextArea.nativeElement,
     this.caretPosition ? this.caretPosition[1] : undefined
     );
  }
  onTextAreaBlur(event: any) {
    this.startProcessing();
    this.refreshView(this.sanitisedHtml as string);
    this.data.emit({
      text: this.editorTextArea.nativeElement?.innerText,
      html: this.editorTextArea.nativeElement?.innerHTML,
      errorCount: this.errorCount,
    });
    this.focused = false;
    window.getSelection()?.removeAllRanges();
    this.blurEvent.emit(event);

  }
  onClick(event: MouseEvent) {
    this.clickEvent.emit(event);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.focusMonitor.stopMonitoring(this.editorTextArea);
    this.stateChanges.complete();
  }
  nodeWalk(node: ChildNode, func: any) {
    let result = func(node);
    for (
      node = node.firstChild;
      result !== false && node;
      node = node.nextSibling
    ) {
      result = this.nodeWalk(node, func);
    }
    return result;
  }
  // getCaretPosition: return [start, end] as offsets to elem.textContent that
  //   correspond to the selected portion of text
  //   (if start == end, caret is at given position and no text is selected)
  getCaretPosition(elem: any) {
    const sel = window.getSelection();
    let cumLength = [0, 0];
    if (sel?.anchorNode == elem) {
      cumLength = [sel.anchorOffset, sel.focusOffset];
    } else {
      const nodeToFind = [sel?.anchorNode, sel?.focusNode];
      if (!elem.contains(sel?.anchorNode) || !elem.contains(sel?.focusNode)) {
        return undefined;
      } else {
        const found = [false, false];
        let i: number;
        this.nodeWalk(elem, (node: any) => {
          for (i = 0; i < 2; i++) {
            if (node == nodeToFind[i]) {
              found[i] = true;
              if (found[i == 0 ? 1 : 0]) {
                return false;
              } // all done
            }
          }
          if (node.textContent && !node.firstChild) {
            for (i = 0; i < 2; i++) {
              if (!found[i]) {
                cumLength[i] += node.textContent.length;
              }
            }
          }
          return;
        });
        cumLength[0] += sel.anchorOffset;
        cumLength[1] += sel.focusOffset;
      }
    }
    if (cumLength[0] <= cumLength[1]) {
      return cumLength;
    }
    return [cumLength[1], cumLength[0]];
  }
  SetCaretPosition(el: any, pos: number) {
    // Loop through all child nodes
    for (const node of el.childNodes) {
      if (node.nodeType == 3) {
        // we have a text node
        if (node.length >= pos) {
          // finally add our range
          const range = document.createRange(),
            sel = window.getSelection();
          range.setStart(node, pos);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          return -1; // we are done
        } else {
          pos -= node.length;
        }
      } else {
        pos = this.SetCaretPosition(node, pos);
        if (pos == -1) {
          return -1; // no need to finish the for loop
        }
      }
    }
    return pos; // needed because of recursion stuff
  }
  findNodesForProcessing(currentValue: string) {
    const previousValueArray = this.splitText(this.previousValue);
    const currentValueArray = this.splitText(currentValue);
    let leftPointer = 0;
    let rightPointerForCurrent = currentValueArray.length - 1;
    let rightPointerForPrevious = previousValueArray.length - 1;
    let startNodeIndex = 0;
    let endNodeIndex = rightPointerForPrevious;
    let rightFound = false;
    while (
      currentValueArray[leftPointer] &&
      previousValueArray[leftPointer] &&
      currentValueArray[leftPointer] === previousValueArray[leftPointer]
    ) {
      leftPointer++;
    }
    if (leftPointer === previousValueArray.length) {
      leftPointer--;
    }
    startNodeIndex = leftPointer;
    while (leftPointer < rightPointerForPrevious && !rightFound) {
      if (
        currentValueArray[rightPointerForCurrent] !==
        previousValueArray[rightPointerForPrevious] &&
        !rightFound
      ) {
        endNodeIndex = rightPointerForPrevious;
        rightFound = true;
      } else if (!rightFound) {
        rightPointerForPrevious--;
        rightPointerForCurrent--;
      }
    }
    if (leftPointer === rightPointerForPrevious) {
      endNodeIndex = rightPointerForPrevious;
    }
    let unProcessedStringCurrent = "";
    for (let i = leftPointer; i <= rightPointerForCurrent; i++) {
      if (currentValueArray[i]) {
        unProcessedStringCurrent += currentValueArray[i];
      }
    }
    let unProcessedStringPrevious = "";
    for (let i = leftPointer; i <= rightPointerForPrevious; i++) {
      if (previousValueArray[i]) {
        unProcessedStringPrevious += previousValueArray[i];
      }
    }
    return {
      startNodeIndex,
      endNodeIndex,
      unProcessedStringCurrent,
      unProcessedStringPrevious,
    };
  }
  splitText(text: string) {
    const words = [];
    let newWord = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.trim().length === 0 && newWord.trim().length === 0) {
        newWord += char;
      } else if (
        char.trim().length === 0 &&
        newWord.length > 0 &&
        newWord.trim().length > 0
      ) {
        i--;
        words.push(newWord);
        newWord = "";
        continue;
      } else if (
        char.trim().length !== 0 &&
        newWord.length > 0 &&
        newWord.trim().length === 0
      ) {
        i--;
        words.push(newWord);
        newWord = "";
        continue;
      } else {
        newWord += char;
      }
    }
    words.push(newWord);
    return words;
  }

  handleEnterKey(event: any) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      document.execCommand("insertLineBreak");
    }
  }

  handleSpaceAndBackSpace() {
    this.commonService.listenTransmissionMode.subscribe((value) => {
      if (value === FccGlobalConstant.TRANS_MODE_SWIFT) {
        this.properties.showHighlight = true;
      } else {
        this.properties.showHighlight = false;
      }
    });
    if (!this.highlightApplied) {
    this.editorValueMap = this.highLightHtmlPipe.reApplyHighlight(this.editorTextArea.nativeElement.innerText,
      this.typeOfRegex, this.properties.showHighlight);
      const htmlContent = `${this.editorValueMap.get("highlightedValue")}`;
      if (this.properties.sanitize) {
        this.sanitisedHtml = this.sanitizer.sanitize(
          SecurityContext.HTML,
          htmlContent
        );
      }
      this.nodeArray = this.editorValueMap.get("nodeArray");
      this.previousValue = this.editorTextArea.nativeElement.innerText;
      this.isRefreshView = true;
      this.caretPosition = this.getCaretPosition(
        this.editorTextArea.nativeElement
      );
      this.errorCount = parseInt(this.editorValueMap.get("totalErrorCount"), 10);
    }
    this.highlightApplied = false;
  }
}
