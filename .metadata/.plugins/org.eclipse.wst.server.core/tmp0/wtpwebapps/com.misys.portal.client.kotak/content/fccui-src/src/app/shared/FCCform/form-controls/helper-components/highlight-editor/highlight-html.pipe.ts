import { Pipe, PipeTransform } from "@angular/core";
import { FccGlobalConstant } from "../../../../../common/core/fcc-global-constants";
import { INodeData } from "./highlight-editor.model";

export interface IHighlightObj {
  highlightedValue: string;
  totalErrorCount: string;
}

@Pipe({
  name: "highlightHtml",
})
export class HighlightHtmlPipe implements PipeTransform {
  highlightedObject: Map<string, any> = new Map();
  val = "";
  transform(
    value: string,
    args: string,
    startIndex: number,
    endIndex: number,
    nodeArray: INodeData[]
  ): Map<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const space = "&nbsp;"; //use this to remove warning text at end
    const emtyString = "";
    let regex: RegExp | null;
    if (args === "X") {
      regex = new RegExp(FccGlobalConstant.X_CHARACTER_NOT_ALLOWED, "gm");
    } else if (args === "Z") {
      regex = new RegExp(FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED, "gm");
    }
    let totalErrorCount = 0;
    // const match = value.match(regex);
    // if (!match) {
    //   if (value && value.length) {
    //     this.highlightedObject.set("highlightedValue", value);
    //     this.highlightedObject.set(
    //       "totalErrorCount",
    //       totalErrorCount.toString()
    //     );
    //     return this.highlightedObject;
    //   } else {
    //     return new Map();
    //   }
    // }
    let valueArray: string[] | null = [];

    valueArray = this.splitText(value);
    value = "";
    this.highlightedObject = new Map();
    if (valueArray !== null) {
      if (startIndex === endIndex && nodeArray?.length === startIndex) {
        this.createAllNodes(
          valueArray,
          regex,
          nodeArray,
          startIndex,
          endIndex + valueArray.length
        );
        this.highlightedObject.set("nodeArray", nodeArray);
      } else {
        const newNodeArray: INodeData[] = [];
        for (let index = 0; index < startIndex; index++) {
          newNodeArray[index] = { ...nodeArray[index] };
        }
        this.createAllNodes(
          valueArray,
          regex,
          newNodeArray,
          startIndex,
          startIndex + valueArray.length
        );
        if (nodeArray) {
          for (
            let index = newNodeArray.length;
            nodeArray[++endIndex] !== undefined;
            index++
          ) {
            newNodeArray[index] = { ...nodeArray[endIndex] };
          }
        }
        this.highlightedObject.set("nodeArray", newNodeArray);
      }
    }
    value = this.createHtmlFromAllNodes(
      this.highlightedObject.get("nodeArray")
    );
    value = `${value}<span class="no-highlight">${emtyString}</span>`;
    this.val = value;
    totalErrorCount = this.val.split("</font>").length - 1;
    this.highlightedObject.set("highlightedValue", value);
    this.highlightedObject.set("totalErrorCount", totalErrorCount.toString());
    return this.highlightedObject;
  }

  createHtmlFromAllNodes(allNodes: INodeData[]) {
    let htmlAsString = "";
    allNodes.forEach((node) => {
      htmlAsString += node.html;
    });
    return htmlAsString;
  }

  createAllNodes(
    valueArray: RegExpMatchArray | null,
    regex: RegExp | null,
    nodeArray: INodeData[],
    startIndex: number,
    endIndex: number
  ) {
    if (valueArray) {
      let indexCount = 0;
      let valueArrayIndex = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const element = valueArray[valueArrayIndex++];
        if (element.length && element.length > 0) {
          let val = "";
          if (
            regex &&
            element.match(regex) &&
            element.match(regex)?.length !== 0
          ) {
            const illegalCharsInWord = element.match(regex);
            const allValidWords = element.split(regex);
            val += `<span class='highlight'>`;
            for (let i = 0; i < allValidWords.length; i++) {
              const word = allValidWords[i];
              val += word;
              if (illegalCharsInWord && i < illegalCharsInWord?.length) {
                val += `<font class='color-highlight'>${illegalCharsInWord[i]}</font>`;
              }
            }
            val += "</span>";
          } else {
            val = `<span>${element}</span>`;
          }
          nodeArray[i] = {
            html: val,
            startIndex: indexCount,
            endIndex: indexCount + element.length - 1,
          };
          indexCount += element.length;
        }
      }
    }
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

  reApplyHighlight(text: string, args: string, textHighlight: boolean): any {
    if(textHighlight) {
    return this.transform(text, args, 0, text.split(' ').length - 1, null);
    } else {
      return this.transformNonHighlighttextArea(text, args, 0, text.split(' ').length - 1, null);
    }
  }

  transformNonHighlighttextArea(
    value: string,
    args: string,
    startIndex: number,
    endIndex: number,
    nodeArray: INodeData[]
  ): Map<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const space = "&nbsp;"; //use this to remove warning text at end
    const emtyString = "";
    let regex: RegExp | null;
    if (args === "X") {
      regex = new RegExp(FccGlobalConstant.X_CHARACTER_NOT_ALLOWED, "gm");
    } else if (args === "Z") {
      regex = new RegExp(FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED, "gm");
    }
    //let totalErrorCount = 0;
    let valueArray: string[] | null = [];

    valueArray = this.splitText(value);
    value = "";
    this.highlightedObject = new Map();
    if (valueArray !== null) {
      if (startIndex === endIndex && nodeArray?.length === startIndex) {
        this.createAllNodesForNonHighlighttextArea(
          valueArray,
          regex,
          nodeArray,
          startIndex,
          endIndex + valueArray.length
        );
        this.highlightedObject.set("nodeArray", nodeArray);
      } else {
        const newNodeArray: INodeData[] = [];
        for (let index = 0; index < startIndex; index++) {
          newNodeArray[index] = { ...nodeArray[index] };
        }
        this.createAllNodesForNonHighlighttextArea(
          valueArray,
          regex,
          newNodeArray,
          startIndex,
          startIndex + valueArray.length
        );
        if (nodeArray) {
          for (
            let index = newNodeArray.length;
            nodeArray[++endIndex] !== undefined;
            index++
          ) {
            newNodeArray[index] = { ...nodeArray[endIndex] };
          }
        }
        this.highlightedObject.set("nodeArray", newNodeArray);
      }
    }
    value = this.createHtmlFromAllNodes(
      this.highlightedObject.get("nodeArray")
    );
    value = `${value}<span class="no-highlight">${emtyString}</span>`;
    this.val = value;
    //totalErrorCount = this.val.split("</font>").length - 1;
    this.highlightedObject.set("highlightedValue", value);
    this.highlightedObject.set("totalErrorCount", 0);
    return this.highlightedObject;
  }

  createAllNodesForNonHighlighttextArea(
    valueArray: RegExpMatchArray | null,
    regex: RegExp | null,
    nodeArray: INodeData[],
    startIndex: number,
    endIndex: number
  ) {
    if (valueArray) {
      let indexCount = 0;
      let valueArrayIndex = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const element = valueArray[valueArrayIndex++];
        if (element.length && element.length > 0) {
          let val = "";
            val = `<span>${element}</span>`;

          nodeArray[i] = {
            html: val,
            startIndex: indexCount,
            endIndex: indexCount + element.length - 1,
          };
          indexCount += element.length;
        }
      }
    }
  }
}
