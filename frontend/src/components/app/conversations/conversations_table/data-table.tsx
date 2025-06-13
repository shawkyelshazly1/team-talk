"use client";

import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	PaginationState,
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
import { useEffect, useMemo, useState } from "react";
import { useLoadInfiniteHistoricalConversations } from "@/services/queries/conversation";
import { useRouter, useSearchParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { columns } from "@/components/app/conversations/conversations_table/columns";

export function ConversationsTable() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0, //initial page index
		pageSize: 12, //default page size
	});

	const searchParams = useSearchParams();
	const router = useRouter();

	const {
		data: conversations,
		status,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useLoadInfiniteHistoricalConversations({
		agents: searchParams.get("agents") ?? "",
		teamLeaders: searchParams.get("teamLeaders") ?? "",
		take: pagination.pageSize,
	});

	// Get current page data
	const currentPageData = useMemo(() => {
		const pageIndex = pagination.pageIndex;
		const currentPage = conversations?.pages[pageIndex];
		return currentPage?.conversations ?? [];
	}, [conversations, pagination.pageIndex]);

	const { totalCount, pageCount } = useMemo(() => {
		if (!conversations?.pages.length) return { totalCount: 0, pageCount: 0 };

		const total = conversations.pages[0].total;
		const pages = Math.ceil(total / pagination.pageSize);
		return { totalCount: total, pageCount: pages };
	}, [conversations, pagination.pageSize]);

	const table = useReactTable({
		data: currentPageData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: pageCount,
		state: {
			pagination,
		},
		onPaginationChange: setPagination,
	});

	// Auto-fetch logic
	useEffect(() => {
		const needsPage =
			!conversations?.pages[pagination.pageIndex] && hasNextPage;
		if (needsPage && !isFetching) {
			fetchNextPage();
		}
	}, [
		pagination.pageIndex,
		conversations,
		hasNextPage,
		isFetching,
		fetchNextPage,
	]);

	return status === "pending" || (!currentPageData.length && isFetching) ? (
		<div className="flex justify-center items-center h-full">
			<SyncLoader color="#000" />
		</div>
	) : (
		<div className="flex flex-col h-full gap-2">
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
			<div className="rounded-md border overflow-y-auto h-full">
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
									onClick={() => {
										router.push(`/app/conversation/${row.original.id}`);
									}}
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
		</div>
	);
}
