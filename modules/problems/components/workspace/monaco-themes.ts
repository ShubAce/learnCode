import type { Monaco } from "@monaco-editor/react";

/**
 * Monaco themes mirroring the design tokens in app/globals.css.
 * Monaco needs concrete hex colours, so these approximate the OKLCH palette.
 */
export const MONACO_THEMES = { dark: "learncode-dark", light: "learncode-light" } as const;

let defined = false;

export function defineMonacoThemes(monaco: Monaco) {
	if (defined) return;
	defined = true;

	monaco.editor.defineTheme(MONACO_THEMES.dark, {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "", foreground: "e6e2db" },
			{ token: "comment", foreground: "857c70", fontStyle: "italic" },
			{ token: "keyword", foreground: "e88fd0" },
			{ token: "string", foreground: "8fd99b" },
			{ token: "number", foreground: "f1b77d" },
			{ token: "type", foreground: "7fd6d9" },
			{ token: "type.identifier", foreground: "7fd6d9" },
			{ token: "identifier", foreground: "e6e2db" },
			{ token: "delimiter", foreground: "a89f93" },
			{ token: "operator", foreground: "d4a373" },
			{ token: "annotation", foreground: "f2a98f" },
		],
		colors: {
			"editor.background": "#1a1816",
			"editor.foreground": "#e6e2db",
			"editor.lineHighlightBackground": "#23201d",
			"editor.lineHighlightBorder": "#00000000",
			"editorLineNumber.foreground": "#4f4840",
			"editorLineNumber.activeForeground": "#f2b544",
			"editorCursor.foreground": "#f2b544",
			"editor.selectionBackground": "#f2b54433",
			"editor.inactiveSelectionBackground": "#f2b5441f",
			"editor.findMatchHighlightBackground": "#f2b54440",
			"editorBracketMatch.background": "#f2b5441f",
			"editorBracketMatch.border": "#f2b54466",
			"editorBracketHighlight.foreground1": "#f2b544",
			"editorBracketHighlight.foreground2": "#e88fd0",
			"editorBracketHighlight.foreground3": "#7fd6d9",
			"editorIndentGuide.background1": "#2b2723",
			"editorIndentGuide.activeBackground1": "#4a433b",
			"editorWidget.background": "#201d1a",
			"editorWidget.border": "#2f2a25",
			"editorSuggestWidget.selectedBackground": "#2f2a25",
			"scrollbarSlider.background": "#ffffff12",
			"scrollbarSlider.hoverBackground": "#ffffff20",
			"scrollbarSlider.activeBackground": "#ffffff2a",
		},
	});

	monaco.editor.defineTheme(MONACO_THEMES.light, {
		base: "vs",
		inherit: true,
		rules: [
			{ token: "", foreground: "3a3530" },
			{ token: "comment", foreground: "8a8378", fontStyle: "italic" },
			{ token: "keyword", foreground: "a3307f" },
			{ token: "string", foreground: "2f7d3e" },
			{ token: "number", foreground: "b5521e" },
			{ token: "type", foreground: "10808f" },
			{ token: "type.identifier", foreground: "10808f" },
			{ token: "identifier", foreground: "3a3530" },
			{ token: "delimiter", foreground: "6f675d" },
			{ token: "operator", foreground: "9a5b1c" },
			{ token: "annotation", foreground: "b5521e" },
		],
		colors: {
			"editor.background": "#ffffff",
			"editor.foreground": "#3a3530",
			"editor.lineHighlightBackground": "#faf6ee",
			"editor.lineHighlightBorder": "#00000000",
			"editorLineNumber.foreground": "#c9c1b4",
			"editorLineNumber.activeForeground": "#c27c0e",
			"editorCursor.foreground": "#c27c0e",
			"editor.selectionBackground": "#eda33a3d",
			"editor.inactiveSelectionBackground": "#eda33a24",
			"editorBracketMatch.background": "#eda33a24",
			"editorBracketMatch.border": "#eda33a80",
			"editorBracketHighlight.foreground1": "#b56b00",
			"editorBracketHighlight.foreground2": "#a3307f",
			"editorBracketHighlight.foreground3": "#10808f",
			"editorIndentGuide.background1": "#efe9df",
			"editorIndentGuide.activeBackground1": "#d8cfc1",
			"editorWidget.background": "#fffdf9",
			"editorWidget.border": "#e8e1d6",
			"scrollbarSlider.background": "#00000010",
			"scrollbarSlider.hoverBackground": "#0000001c",
			"scrollbarSlider.activeBackground": "#00000026",
		},
	});
}
