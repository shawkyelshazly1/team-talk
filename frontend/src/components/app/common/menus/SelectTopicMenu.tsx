import { topics } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function SelectTopicMenu({
	selectedTopic,
	setSelectedTopic,
}: {
	selectedTopic: string;
	setSelectedTopic: (topic: string) => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className="w-full">
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between cursor-pointer"
				>
					{selectedTopic
						? topics.find((topic) => topic === selectedTopic)
						: "Select Topic..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[450px] p-0">
				<Command className="w-full">
					<CommandInput placeholder="Search framework..." className="w-full" />
					<CommandList className="w-full">
						<CommandEmpty>No topics found.</CommandEmpty>
						<CommandGroup className="w-full ">
							{topics.map((topic) => (
								<CommandItem
									className="w-full cursor-pointer"
									key={topic}
									value={topic}
									onSelect={(currentValue) => {
										setSelectedTopic(
											currentValue === selectedTopic ? "" : currentValue
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											topic === selectedTopic ? "opacity-100" : "opacity-0"
										)}
									/>
									{topic}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
