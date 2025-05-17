"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import RichMessageInputToolbar from "./RichMessageInputToolbar";
import { SendHorizonal } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { EditorState, SerializedEditorState } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
	console.error(error);
}

export default function RichMessageInput() {
	const initialConfig = {
		namespace: "rich-message-input",
		theme: exampleTheme,
		onError,
	};

	const [editorState, setEditorState] = useState<string>("");

	function handleChange(state: EditorState) {
		const stateJson = state.toJSON();
		setEditorState(JSON.stringify(stateJson));
	}

	return (
		<div className="border-2 border-border rounded-lg  ">
			<LexicalComposer initialConfig={initialConfig}>
				<RichTextPlugin
					contentEditable={
						<ContentEditable className="focus-visible:outline-none p-2 max-h-[100px] overflow-y-auto" />
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<div className="flex flex-row justify-between">
					<RichMessageInputToolbar />
					<SendHorizonal
						onClick={() => {
							console.log(editorState);
							let test = JSON.parse(editorState);
							console.log(test);
							const [editor] = useLexicalComposerContext();
							console.log($generateHtmlFromNodes(editor, test));
						}}
						className=" mr-2 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer"
						size={30}
					/>
				</div>
				<OnChangePlugin onChange={handleChange} />
			</LexicalComposer>
		</div>
	);
}

function OnChangePlugin({
	onChange,
}: {
	onChange: (state: EditorState) => void;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			onChange(editorState);
		});
	}, [editor, onChange]);
	return null;
}

const exampleTheme = {
	ltr: "ltr",
	rtl: "rtl",
	placeholder: "editor-placeholder",
	paragraph: "mb-2 relative",
	quote: "editor-quote",
	heading: {
		h1: "text-3xl font-extrabold dark:text-white",
		h2: "text-2xl font-bold dark:text-white",
		h3: "text-xl font-bold dark:text-white",
		h4: "text-lg font-bold dark:text-white",
		h5: "font-bold dark:text-white",
	},
	list: {
		nested: {
			listitem: "pl-5 mt-2 space-y-1 list-decimal list-inside dark:text-white",
		},
		ol: "max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-white",
		ul: "max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-white",
		listitem: "dark:text-white",
	},
	image: "editor-image",
	link: "font-medium text-blue-600 dark:text-blue-500 hover:underline",
	text: {
		bold: "font-bold",
		italic: "italic",
		overflowed: "editor-text-overflowed",
		hashtag: "editor-text-hashtag",
		underline: "underline",
		strikethrough: "line-through",
		underlineStrikethrough: "underline line-through",
		code: "font-mono text-[94%] bg-gray-100 dark:bg-gray-600 dark:text-white p-1 rounded",
	},
	code: "bg-white dark:bg-gray-600 font-mono block py-2 px-8 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-langrage)] after:right-3 after:absolute",
	codeHighlight: {
		atrule: "text-[#07a] dark:text-cyan-400",
		attr: "text-[#07a] dark:text-cyan-400",
		boolean: "text-pink-700 dark:text-pink-400",
		builtin: "text-[#690]",
		cdata: "bg-slate-600",
		char: "text-[#690]",
		class: "text-[#dd4a68]",
		"class-name": "text-[#dd4a68]",
		comment: "bg-slate-600 dark:bg-gray-600",
		constant: "text-pink-700 dark:text-pink-400",
		deleted: "text-pink-700 dark:text-pink-400",
		doctype: "bg-slate-600",
		entity: "text-[#9a6e3a]",
		function: "text-[#dd4a68]",
		important: "text-[#e90]",
		inserted: "text-[#690]",
		keyword: "text-[#07a] dark:text-cyan-400",
		namespace: "text-[#e90] dark:text-blue-400",
		number: "text-pink-700 dark:text-pink-400",
		operator: "text-[#9a6e3a]",
		prolog: "bg-slate-600",
		property: "text-pink-700 dark:text-pink-400",
		punctuation: "text-[#999]",
		regex: "text-[#e90] dark:text-blue-400",
		selector: "text-[#690]",
		string: "text-[#690] dark:text-orange-500",
		symbol: "text-pink-700 dark:text-pink-400",
		tag: "text-pink-700 dark:text-pink-400",
		url: "text-[#9a6e3a]",
		variable: "text-[#e90] dark:text-blue-400",
	},
};
