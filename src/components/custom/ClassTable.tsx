import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Class } from "@/interface";
import { columnsClass } from "@/components/custom";
import { ListFilter } from "lucide-react";

interface ClassTableProps {
	data: Class[];
}

const ClassTable = ({ data }: ClassTableProps) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 4,
	});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const uniqueTeachers = React.useMemo(() => {
		const teachers = data.map((item) => item.teacher);
		return Array.from(new Set(teachers));
	}, [data]);

	const table = useReactTable({
		data,
		columns: columnsClass,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	React.useEffect(() => {
		table.setPagination(pagination);
	}, [pagination, table]);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4 gap-x-4">
				<Input
					placeholder="Filter name..."
					value={
						(table.getColumn("class_id")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("class_id")?.setFilterValue(event.target.value)
					}
					className="max-w-xs"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							<ListFilter className="w-5 h-5" />
							Filter
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuCheckboxItem
							className="capitalize"
							checked={!table.getColumn("teacher")?.getFilterValue()}
							onClick={() => {
								table.getColumn("teacher")?.setFilterValue("");
							}}
						>
							All
						</DropdownMenuCheckboxItem>
						{uniqueTeachers.map((teacher) => (
							<DropdownMenuCheckboxItem
								key={teacher}
								className="capitalize"
								checked={
									table.getColumn("teacher")?.getFilterValue() === teacher
								}
								onClick={() => {
									table.getColumn("teacher")?.setFilterValue(teacher);
								}}
							>
								{teacher}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="grid grid-cols-7 w-full"
							>
								{headerGroup.headers.map((header, index) => {
									return (
										<TableHead
											key={header.id}
											className={`flex items-center ${
												index === headerGroup.headers.length - 1 ||
												index === 0 ||
												index === 1
													? "col-span-1"
													: "col-span-2"
											}`}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
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
									className="grid grid-cols-7 w-full items-center"
								>
									{row.getVisibleCells().map((cell, index) => (
										<TableCell
											key={cell.id}
											className={
												index === row.getVisibleCells().length - 1 ||
												index === 0 ||
												index === 1
													? "col-span-1"
													: "col-span-2"
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columnsClass.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{table.getRowModel().rows?.length ? (
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ClassTable;
