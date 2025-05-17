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

const teamLeaders = [
	{
		value: "teamleader1@gmail.com",
		label: "Team Leader 1",
	},
	{
		value: "teamleader2@gmail.com",
		label: "Team Leader 2",
	},
	{
		value: "teamleader3@gmail.com",
		label: "Team Leader 3",
	},
	{
		value: "teamleader4@gmail.com",
		label: "Team Leader 4",
	},
	{
		value: "teamleader5@gmail.com",
		label: "Team Leader 5",
	},
	{
		value: "teamleader6@gmail.com",
		label: "Team Leader 6",
	},
	{
		value: "teamleader7@gmail.com",
		label: "Team Leader 7",
	},
	{
		value: "teamleader8@gmail.com",
		label: "Team Leader 8",
	},
	{
		value: "teamleader9@gmail.com",
		label: "Team Leader 9",
	},
	{
		value: "teamleader10@gmail.com",
		label: "Team Leader 10",
	},
	{
		value: "teamleader11@gmail.com",
		label: "Team Leader 11",
	},
	{
		value: "teamleader12@gmail.com",
		label: "Team Leader 12",
	},
	{
		value: "teamleader13@gmail.com",
		label: "Team Leader 13",
	},
	{
		value: "teamleader14@gmail.com",
		label: "Team Leader 14",
	},
	{
		value: "teamleader15@gmail.com",
		label: "Team Leader 15",
	},
];

export default function TeamLeaderFilter() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [selectedTeamLeaders, setSelectedTeamLeaders] = useState<string[]>([]);
	const [sortedTeamLeaders, setSortedTeamLeaders] =
		useState<{ value: string; label: string }[]>(teamLeaders);
	const searchParams = useSearchParams();

	useEffect(() => {
		const teamLeaders = searchParams.get("teamLeaders");

		if (teamLeaders) {
			setSelectedTeamLeaders(teamLeaders.split(","));
		} else {
			setSelectedTeamLeaders([]);
		}
	}, [searchParams]);

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

			const sortedTeamLeaders = [...teamLeaders].sort((a, b) => {
				const aSelected = selectedTeamLeaders.includes(a.value);
				const bSelected = selectedTeamLeaders.includes(b.value);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
			});

			setSortedTeamLeaders(sortedTeamLeaders);
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className="cursor-pointer">
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-[200px] justify-between ",
						selectedTeamLeaders.length > 0 &&
							"bg-black/80 text-white hover:bg-black/80 hover:text-white"
					)}
				>
					{selectedTeamLeaders.length === 0
						? "Select Team Leaders"
						: selectedTeamLeaders.length === 1
						? teamLeaders.find(
								(teamLeader) => teamLeader.value === selectedTeamLeaders[0]
						  )?.label
						: `${selectedTeamLeaders.length} TLs Selected`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search Team Leaders..." />
					<CommandList>
						<CommandEmpty>No teamLeader found.</CommandEmpty>
						<CommandGroup>
							{sortedTeamLeaders.map((teamLeader) => (
								<CommandItem
									key={teamLeader.value}
									value={teamLeader.value}
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
											selectedTeamLeaders.includes(teamLeader.value)
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{teamLeader.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
