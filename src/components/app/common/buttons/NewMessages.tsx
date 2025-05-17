import { ArrowDown } from "lucide-react";

export default function NewMessages({
	scrollToBottom,
}: {
	scrollToBottom: () => void;
}) {
	return (
		<div
			className="absolute bottom-[17%] left-[65%] transform -translate-x-1/2 rounded-full cursor-pointer"
			onClick={scrollToBottom}
		>
			<div className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/80 transition-all duration-300">
				New Messages
				<ArrowDown className="w-4 h-4" />
			</div>
		</div>
	);
}
