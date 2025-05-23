"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchConversationsInput() {
	const [searchQuery, setSearchQuery] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const query = searchParams.get("query");

		if (query) {
			setSearchQuery(query);
		} else {
			setSearchQuery("");
		}
	}, [searchParams]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			const searchParams = new URLSearchParams(window.location.search);
			if (searchQuery) {
				searchParams.set("query", searchQuery);
			} else {
				searchParams.delete("query");
			}
			const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
			window.history.pushState({}, "", newUrl);
			// remove focus from input
			searchRef.current?.blur();
		}
	}

	return (
		<div className="flex flex-row gap-0 bg-accent-foreground/5 focus-within:bg-white   w-full md:w-1/2  xl:w-1/3 rounded-2xl h-12 items-center focus-within:shadow-sm px-2">
			<Button
				variant="outline"
				className="p-0 rounded-full bg-transparent outline-0 border-0 ring-0 ring-offset-0 cursor-pointer m-0 hover:bg-muted-foreground/10"
			>
				<Search className="w-4 h-4" />
			</Button>
			<Input
				ref={searchRef}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search in conversations"
				className="w-full focus-visible:border-0 focus-visible:ring-0 border-0 ring-0 outline-none shadow-none "
			/>
			<Button
				variant="outline"
				className={cn(
					"p-0 rounded-full bg-transparent outline-0 border-0 ring-0 ring-offset-0 cursor-pointer m-0 hover:bg-muted-foreground/10 hidden",
					searchQuery.length > 0 && "inline-block"
				)}
				onClick={() => {
					setSearchQuery("");
					const searchParams = new URLSearchParams(window.location.search);
					searchParams.delete("query");
					const newUrl = `${
						window.location.pathname
					}?${searchParams.toString()}`;
					window.history.pushState({}, "", newUrl);
					searchRef.current?.focus();
				}}
			>
				<X size={25} />
			</Button>
		</div>
	);
}
