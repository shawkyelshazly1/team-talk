"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClearFiltersButton() {
	const searchParams = useSearchParams();
	const [hasFilters, setHasFilters] = useState(false);

	useEffect(() => {
		const hasFilters = Array.from(searchParams.entries()).length > 0;
		setHasFilters(hasFilters);
	}, [searchParams]);

	return (
		<Button
			variant="default"
			disabled={!hasFilters}
			className={cn(
				hasFilters &&
					"bg-black/80 text-white hover:bg-black/80 hover:text-white cursor-pointer"
			)}
			onClick={() => {
				const params = new URLSearchParams(searchParams);
				Array.from(params.keys()).forEach((key) => {
					params.delete(key);
				});
				window.history.pushState(
					{},
					"",
					`${window.location.pathname}?${params.toString()}`
				);
			}}
		>
			Clear Filters
		</Button>
	);
}
