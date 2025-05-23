"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useLoadConversations } from "@/services/queries/conversation";
import { useSearchParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { columns } from "@/components/app/conversations/conversations_table/columns";

export function ConversationsTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const searchParams = useSearchParams();

	const {
		data: conversations,
		isLoading,
		isRefetching,
		refetch,
	} = useLoadConversations({
		agents: searchParams.get("agents") ?? "",
		teamLeaders: searchParams.get("teamLeaders") ?? "",
		take: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
	});

	useEffect(() => {
		refetch();
	}, [searchParams, pagination]);

	const table = useReactTable({
		data: conversations ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		state: {
			pagination,
		},
		onPaginationChange: setPagination,
	});

	return isLoading || isRefetching ? (
		<div className="flex justify-center items-center h-full">
			<SyncLoader color="#000" />
		</div>
	) : (
		<div className="flex flex-col h-[85vh] gap-2">
			<div className="rounded-md border overflow-y-auto h-[72vh]">
				<Table>
					<TableHeader className="rounded-t-md overflow-hidden">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-sm font-semibold bg-gray-100 text-gray-700"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={cn(
										row.index % 2 === 0 ? "bg-white" : "bg-gray-50",
										"hover:bg-gray-100 cursor-pointer"
									)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4 mt-auto">
				<Button
					className="cursor-pointer"
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					className="cursor-pointer"
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
