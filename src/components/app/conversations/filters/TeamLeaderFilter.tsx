"use client";
import { Check } from "lucide-react";

import { Command, CommandItem } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { CommandEmpty } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useLoadTeamleadersFilter } from "@/services/queries/filters";

export default function TeamLeaderFilter() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [selectedTeamLeaders, setSelectedTeamLeaders] = useState<string[]>([]);
	const [sortedTeamLeaders, setSortedTeamLeaders] = useState<string[]>([]);
	const searchParams = useSearchParams();

	// load team leaders
	const { data: teamLeaders, isLoading: teamLeadersLoading } =
		useLoadTeamleadersFilter();

	// handle team leaders data
	useEffect(() => {
		if (teamLeaders) {
			setSortedTeamLeaders(teamLeaders);
		}
	}, [teamLeaders]);

	useEffect(() => {
		const teamLeaders = searchParams.get("teamLeaders");

		if (teamLeaders) {
			setSelectedTeamLeaders(teamLeaders.split(","));
		} else {
			setSelectedTeamLeaders([]);
		}
	}, [searchParams]);

	// handle team leaders search params change
	useEffect(() => {
		if (!open) {
			const searchParams = new URLSearchParams(window.location.search);
			if (selectedTeamLeaders.length > 0) {
				searchParams.set("teamLeaders", selectedTeamLeaders.join(","));
			} else {
				searchParams.delete("teamLeaders");
			}
			const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
			window.history.pushState({}, "", newUrl);

			const sortedTeamLeaders = teamLeaders?.sort((a, b) => {
				const aSelected = selectedTeamLeaders.includes(a);
				const bSelected = selectedTeamLeaders.includes(b);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
			});

			setSortedTeamLeaders(sortedTeamLeaders ?? []);
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				asChild
				className="cursor-pointer"
				disabled={teamLeadersLoading}
			>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-fit min-w-[200px] justify-between ",
						selectedTeamLeaders.length > 0 &&
							"bg-black/80 text-white hover:bg-black/80 hover:text-white"
					)}
				>
					{selectedTeamLeaders.length === 0
						? "Select Team Leaders"
						: selectedTeamLeaders.length === 1
						? teamLeaders?.find(
								(teamLeader) => teamLeader === selectedTeamLeaders[0]
						  )
						: `${selectedTeamLeaders.length} TLs Selected`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0">
				<Command>
					<CommandInput placeholder="Search Team Leaders..." />
					<CommandList>
						<CommandEmpty>No teamLeader found.</CommandEmpty>
						<CommandGroup>
							{sortedTeamLeaders.map((teamLeader) => (
								<CommandItem
									key={teamLeader}
									value={teamLeader}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setSelectedTeamLeaders((prev) =>
											prev.includes(currentValue)
												? prev.filter((item) => item !== currentValue)
												: [...prev, currentValue]
										);
										// setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedTeamLeaders.includes(teamLeader)
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{teamLeader}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
