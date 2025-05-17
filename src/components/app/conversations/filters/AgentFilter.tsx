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

const agents = [
	{
		value: "agent1@gmail.com",
		label: "Agent 1",
	},
	{
		value: "agent2@gmail.com",
		label: "Agent 2",
	},
	{
		value: "agent3@gmail.com",
		label: "Agent 3",
	},
	{
		value: "agent4@gmail.com",
		label: "Agent 4",
	},
	{
		value: "agent5@gmail.com",
		label: "Agent 5",
	},
	{
		value: "agent6@gmail.com",
		label: "Agent 6",
	},
	{
		value: "agent7@gmail.com",
		label: "Agent 7",
	},
	{
		value: "agent8@gmail.com",
		label: "Agent 8",
	},
	{
		value: "agent9@gmail.com",
		label: "Agent 9",
	},
	{
		value: "agent10@gmail.com",
		label: "Agent 10",
	},
	{
		value: "agent11@gmail.com",
		label: "Agent 11",
	},
	{
		value: "agent12@gmail.com",
		label: "Agent 12",
	},
	{
		value: "agent13@gmail.com",
		label: "Agent 13",
	},
	{
		value: "agent14@gmail.com",
		label: "Agent 14",
	},
	{
		value: "agent15@gmail.com",
		label: "Agent 15",
	},
];

export default function AgentFilter() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
	const [sortedAgents, setSortedAgents] =
		useState<{ value: string; label: string }[]>(agents);
	const searchParams = useSearchParams();

	useEffect(() => {
		const agents = searchParams.get("agents");

		if (agents) {
			setSelectedAgents(agents.split(","));
		} else {
			setSelectedAgents([]);
		}
	}, [searchParams]);

	useEffect(() => {
		if (!open) {
			const searchParams = new URLSearchParams(window.location.search);
			if (selectedAgents.length > 0) {
				searchParams.set("agents", selectedAgents.join(","));
			} else {
				searchParams.delete("agents");
			}
			const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
			window.history.pushState({}, "", newUrl);

			const sortedAgents = [...agents].sort((a, b) => {
				const aSelected = selectedAgents.includes(a.value);
				const bSelected = selectedAgents.includes(b.value);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
			});

			setSortedAgents(sortedAgents);
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
						selectedAgents.length > 0 &&
							"bg-black/80 text-white hover:bg-black/80 hover:text-white "
					)}
				>
					{selectedAgents.length === 0
						? "Select Agents"
						: selectedAgents.length === 1
						? agents.find((agent) => agent.value === selectedAgents[0])?.label
						: `${selectedAgents.length} Agents Selected`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search Agents..." />
					<CommandList>
						<CommandEmpty>No agent found.</CommandEmpty>
						<CommandGroup>
							{sortedAgents.map((agent) => (
								<CommandItem
									key={agent.value}
									value={agent.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setSelectedAgents((prev) =>
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
											selectedAgents.includes(agent.value)
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{agent.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
