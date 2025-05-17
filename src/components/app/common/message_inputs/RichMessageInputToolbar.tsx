import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	LexicalEditor,
} from "lexical";
import { List } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
export default function RichMessageInputToolbar() {
	const [editor] = useLexicalComposerContext();
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			// update text format

			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));
		}
	}, []);

	useEffect(() => {
		editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				$updateToolbar();
			});
		});
	}, [editor, $updateToolbar]);

	return (
		<div className="flex flex-row ">
			<Button
				className={`cursor-pointer rounded-full p-3 w-8 h-8 font-medium text-lg ${
					isBold ? "text-blue-500 hover:text-blue-500" : ""
				}`}
				variant="ghost"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
				}}
			>
				B
			</Button>
			<Button
				className={`cursor-pointer italic rounded-full p-3 w-8 h-8 font-medium text-lg ${
					isItalic ? "text-blue-500 hover:text-blue-500" : ""
				}`}
				variant="ghost"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
				}}
			>
				i
			</Button>
			<Button
				className={`cursor-pointer rounded-full p-3 w-8 h-8 font-medium text-lg ${
					isUnderline ? "text-blue-500 hover:text-blue-500" : ""
				}`}
				variant="ghost"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
				}}
			>
				U
			</Button>
		</div>
	);
}
