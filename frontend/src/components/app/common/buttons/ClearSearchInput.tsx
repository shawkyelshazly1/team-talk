import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { memo } from "react";

export default memo(function ClearSearchInput({
	searchQuery,
	setSearchQuery,
	searchRef,
}: {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	searchRef: React.RefObject<HTMLInputElement>;
}) {
	return (
		<Button
			variant="outline"
			className={cn(
				"p-0 rounded-full bg-transparent outline-0 border-0 ring-0 ring-offset-0 cursor-pointer m-0 hover:bg-muted-foreground/10 hidden",
				searchQuery.length > 0 && "inline-block"
			)}
			// onClick handler to clear the search query state and update the url
			onClick={() => {
				setSearchQuery("");
				const searchParams = new URLSearchParams(window.location.search);
				searchParams.delete("query");
				const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
				window.history.pushState({}, "", newUrl);
				searchRef.current?.focus();
			}}
		>
			<X size={25} />
		</Button>
	);
});
