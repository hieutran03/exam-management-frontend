import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronsUpDown, Trash, Info } from "lucide-react";
import { Exam, Permission } from "@/interface";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { NavigateFunction, useNavigate } from "react-router-dom";
import customAxios from "@/lib/customAxios";

export const columnsExam: ColumnDef<Exam>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "course",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Course
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium truncate">
				{row.getValue("course")}
			</div>
		),
	},
	{
		accessorKey: "time",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Time
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium truncate">
				{row.getValue("time")}
			</div>
		),
	},
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Exam Date
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium truncate">
				{format(new Date(row.original.examDate), "dd/MM/yyyy")}
			</div>
		),
	},
	{
		accessorKey: "teacher",
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Teacher
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<span className="text-sm font-medium">{row.original.teacher}</span>
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const ActionCell = () => {
				const exam = row.original;
				const navigate: NavigateFunction = useNavigate();
				const handleDelete = async () => {
					try {
						const user = await customAxios.get("/auth/my-profile");
						const url = user.data.rolePermission.permissions.includes(
							Permission.QUESTION_MODIFY,
						)
							? "/exams"
							: "/my-exams";

						const response = await customAxios.delete(`${url}/${exam.id}`);

						if (response.status === 200) {
							navigate("/exams");
						}
					} catch (error: any) {
						console.error(error);
					}
				};
				return (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
								>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() =>
										navigator.clipboard.writeText(exam.id.toString())
									}
								>
									Copy ID
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate(`/exams/${exam.id}`)}
									className="flex items-center gap-x-1 cursor-pointer"
								>
									<Info className="h-4 w-4" />
									<span>Details</span>
								</DropdownMenuItem>
								<hr className="my-1" />
								<DropdownMenuItem
									onClick={handleDelete}
									className="flex items-center gap-x-1 text-red-500 hover:!text-red-700 cursor-pointer"
								>
									<Trash className="h-4 w-4" />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				);
			};

			return (
				<div className="flex items-center justify-center">
					<ActionCell />
				</div>
			);
		},
	},
];
