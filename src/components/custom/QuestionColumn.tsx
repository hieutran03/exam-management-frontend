import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronsUpDown, Trash, Info } from "lucide-react";
import { Permission, Question } from "@/interface";
import { Checkbox } from "@/components/ui/checkbox";
import { useLayoutEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import customAxios from "@/lib/customAxios";

export const columnsQuestion: ColumnDef<Question>[] = [
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
		accessorKey: "question",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Question
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-full font-medium truncate">{row.original.content}</div>
		),
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
		accessorKey: "level",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full ml-1"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Level
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const LevelCell = () => {
				const [levelColor, setLevelColor] = useState<string>("");
				const level = row.original.level;

				useLayoutEffect(() => {
					switch (level) {
						case "easy":
							setLevelColor("bg-green-100 text-green-800");
							break;
						case "medium":
							setLevelColor("bg-yellow-100 text-yellow-800");
							break;
						case "hard":
							setLevelColor("bg-red-100 text-red-800");
							break;
						default:
							setLevelColor("bg-gray-100 text-gray-800");
							break;
					}
				}, [level]);

				return (
					<div className="w-full text-center">
						<span
							className={` px-2 py-1 text-xs font-medium rounded-full ${levelColor}`}
						>
							{row.original.level}
						</span>
					</div>
				);
			};

			return (
				<div className="flex items-center justify-center">
					<LevelCell />
				</div>
			);
		},
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
				const question = row.original;
				const navigate: NavigateFunction = useNavigate();

				const handleDelete = async () => {
					try {
						const user = await customAxios.get("/auth/my-profile");
						const url = user.data.rolePermission.permissions.includes(
							Permission.QUESTION_MODIFY,
						)
							? "/questions"
							: "/my-questions";

						const response = await customAxios.delete(`${url}/${question.id}`);

						if (response.status === 200) {
							navigate("/questions");
							toast.success("Question deleted successfully!");
						}
					} catch (error: any) {
						console.error(error);
						toast.error("An error occurred while deleting the question!");
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
										navigator.clipboard.writeText(question.id.toString())
									}
								>
									Copy ID
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate(`/questions/${question.id}`)}
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
