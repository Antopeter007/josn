import { SafeHtml } from "@angular/platform-browser";

export interface IEditorProperties {
  editable?: boolean;
  spellcheck?: boolean;
  height?: "auto" | string;
  minHeight?: "0" | string;
  maxHeight?: "auto" | string;
  width?: "auto" | string;
  minWidth?: "0" | string;
  placeholder?: string;
  defaultParagraphSeparator?: string;
  sanitize?: boolean;
  outline?: boolean;
  resize?: boolean;
  showHighlight?: boolean;
  regex: RegExp | null;
}

export interface IEditorData {
  html: string | SafeHtml;
  text: string;
  errorCount: number;
}

export interface INodeData {
  html: string | SafeHtml,
  startIndex: number,
  endIndex: number,
}

export const IEditorPropertiesData = {
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
};
