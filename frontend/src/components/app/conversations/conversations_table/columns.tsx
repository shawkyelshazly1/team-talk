"use client";
import { ColumnDef } from "@tanstack/react-table";
import PendingBadge from "../../common/badges/PendingBadge";
import SolvedBadge from "../../common/badges/SolvedBadge";
import NewBadge from "../../common/badges/NewBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Conversation } from "@shared/types";
import StatusBagde from "../../common/badges/StatusBagde";
import moment from "moment";

export const columns: ColumnDef<Conversation>[] = [
	{
		header: () => <div className="text-center">CreatedAt</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center">
					{moment(row.original.createdAt).format("DD/MM/YYYY hh:mm A")}
				</div>
			);
		},
		accessorKey: "createdAt",
	},
	{
		header: () => <div className="text-center">Agent</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center flex flex-row items-center gap-2 justify-center mx-auto">
					<Avatar className="w-8 h-8 ring-2 ring-blue-300">
						<AvatarImage src={row.original.agent.image ?? ""} />
						<AvatarFallback className="bg-blue-300 text-white uppercase">
							{row.original.agent.name.charAt(0) +
								row.original.agent.name.charAt(1)}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm">{row.original.agent.email}</p>
				</div>
			);
		},
		accessorKey: "agent",
	},
	{
		header: () => <div className="text-center">Assignee</div>,
		cell: ({ row }) => {
			return row.original.assignee ? (
				<div className="text-center flex flex-row items-center gap-2 justify-center mx-auto">
					<Avatar className="w-8 h-8 ring-2 ring-blue-300">
						<AvatarImage src={row.original.assignee?.image ?? ""} />
						<AvatarFallback className="bg-blue-300 text-white uppercase">
							{row.original.assignee?.name?.charAt(0) +
								row.original.assignee?.name?.charAt(1)}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm">{row.original.agent.email}</p>
				</div>
			) : (
				<div className="text-center flex flex-row items-center gap-2 justify-center mx-auto">
					<p className="text-sm">-</p>
				</div>
			);
		},
		accessorKey: "assignee",
	},
	{
		header: () => <div className="text-center">Team Leaders</div>,
		cell: ({ row }) => {
			return (
				<HoverCard>
					<HoverCardTrigger className="flex flex-row items-center justify-center border-b-[1px] border-blue-500 w-fit mx-auto pb-1 border-dashed">
						{row.original.teamLeaders?.length &&
						row.original.teamLeaders.length > 4 ? (
							<>
								{row.original.teamLeaders?.slice(0, 3).map((tl, idx) => (
									<Avatar
										key={tl.id}
										className={cn(
											"w-8 h-8 ring-2 ring-white",
											idx == 0 ? "ml-0" : "-ml-1"
										)}
									>
										<AvatarImage src={tl?.image ?? ""} />
										<AvatarFallback className="bg-blue-500 text-white uppercase">
											{tl.name.charAt(0) + tl.name.charAt(1)}
										</AvatarFallback>
									</Avatar>
								))}
								<span className="w-8 h-8 ring-2 ring-white rounded-full flex items-center justify-center z-10 -ml-1 bg-white text-black font-medium text-sm">
									+{row.original.teamLeaders.length - 3}
								</span>
							</>
						) : (
							row.original.teamLeaders?.map((tl, idx) => (
								<Avatar
									key={tl.id}
									className={cn(
										"w-8 h-8 ring-2 ring-white",
										idx == 0 ? "ml-0" : "-ml-1"
									)}
								>
									<AvatarImage src={tl?.image ?? ""} />
									<AvatarFallback className="bg-blue-300 text-white uppercase">
										{tl.name.charAt(0) + tl.name.charAt(1)}
									</AvatarFallback>
								</Avatar>
							))
						)}
					</HoverCardTrigger>
					<HoverCardContent className="w-fit flex flex-col gap-2 max-h-[250px] overflow-y-auto">
						{row.original.teamLeaders?.map((tl) => (
							<div key={tl.id} className="flex flex-row items-center gap-2">
								<Avatar>
									<AvatarImage src={tl?.image ?? ""} />
									<AvatarFallback className="bg-blue-300 text-white uppercase">
										{tl.name.charAt(0) + tl.name.charAt(1)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<p className="text-sm font-medium">{tl.name}</p>
									<p className="text-sm text-muted-foreground">{tl.email}</p>
								</div>
							</div>
						))}
					</HoverCardContent>
				</HoverCard>
			);
		},
		accessorKey: "teamLeaders",
	},
	{
		header: () => <div className="text-center">Topic</div>,
		cell: ({ row }) => {
			return <div className="text-center">{row.original.topic}</div>;
		},
		accessorKey: "topic",
	},
	{
		header: () => <div className="text-center">Status</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center">
					<StatusBagde conversation={row.original} />
				</div>
			);
		},
		accessorKey: "status",
	},
];
