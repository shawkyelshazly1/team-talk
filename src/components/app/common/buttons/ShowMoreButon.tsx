"use client";
export default function ShowMoreButon({
	setIsExpanded,
}: {
	setIsExpanded: (isExpanded: boolean) => void;
}) {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				setIsExpanded(true);
			}}
			className="text-sm text-blue-300 hover:text-blue-400 cursor-pointer hover:underline"
		>
			show more
		</button>
	);
}
