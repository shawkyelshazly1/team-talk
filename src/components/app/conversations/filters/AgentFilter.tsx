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
import { useLoadAgentsFilter } from "@/services/queries/filters";

export default function AgentFilter() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
	const [sortedAgents, setSortedAgents] = useState<string[]>([]);
	const searchParams = useSearchParams();

	// load agents
	const { data: agents, isLoading: agentsLoading } = useLoadAgentsFilter();

	useEffect(() => {
		if (agents) {
			setSortedAgents(agents);
		}
	}, [agents]);

	// handle search params change
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

			const sortedAgents = agents?.sort((a, b) => {
				const aSelected = selectedAgents.includes(a);
				const bSelected = selectedAgents.includes(b);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
			});

			setSortedAgents(sortedAgents ?? []);
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				asChild
				className="cursor-pointer"
				disabled={agentsLoading}
			>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-fit min-w-[200px] justify-between ",
						selectedAgents.length > 0 &&
							"bg-black/80 text-white hover:bg-black/80 hover:text-white "
					)}
				>
					{selectedAgents.length === 0
						? "Select Agents"
						: selectedAgents.length === 1
						? agents?.find((agent) => agent === selectedAgents[0])
						: `${selectedAgents.length} Agents Selected`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0">
				<Command>
					<CommandInput placeholder="Search Agents..." />
					<CommandList>
						<CommandEmpty>No agent found.</CommandEmpty>
						<CommandGroup>
							{sortedAgents.map((agent) => (
								<CommandItem
									key={agent}
									value={agent}
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
											selectedAgents.includes(agent)
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{agent}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
