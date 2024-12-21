import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ChevronsUpDown, Trash, Info } from "lucide-react";
import { Question } from "@/interface";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import CustomModal from "./CustomModal";
import { useState } from "react";
import { Label } from "@/components/ui/label";

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
			<div className="w-full font-medium truncate">
				{row.getValue("question")}
			</div>
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
		accessorKey: "type",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full ml-1"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Type
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-full text-center">
				<span
					className={` px-2 py-1 text-xs font-medium rounded-full ${
						row.getValue("type") === "Multiple"
							? "bg-pink-100 text-pink-800"
							: "bg-sky-100 text-sky-800"
					}`}
				>
					{row.getValue("type")}
				</span>
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
		cell: ({ row }) => (
			<div className="w-full text-center">
				<span
					className={` px-2 py-1 text-xs font-medium rounded-full ${
						row.getValue("level") === "Easy"
							? "bg-green-100 text-green-800"
							: row.getValue("level") === "Medium"
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{row.getValue("level")}
				</span>
			</div>
		),
	},
	{
		accessorKey: "createdBy",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created By
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={row.original.createdBy.avatar} alt="Avatar" />
					<AvatarFallback>{row.original.createdBy.name}</AvatarFallback>
				</Avatar>
				<span className="text-sm font-medium">
					{row.original.createdBy.name}
				</span>
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const ActionCell = () => {
				const question = row.original;
				const [open, setOpen] = useState<boolean>(false);

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
									onClick={() => navigator.clipboard.writeText(question.id)}
								>
									Copy ID
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setOpen(true)}
									className="flex items-center gap-x-1 cursor-pointer"
								>
									<Info className="h-4 w-4" />
									<span>Details</span>
								</DropdownMenuItem>
								<hr className="my-1" />
								<DropdownMenuItem className="flex items-center gap-x-1 text-red-500 hover:!text-red-700 cursor-pointer">
									<Trash className="h-4 w-4" />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<CustomModal
							open={open}
							onClose={() => setOpen(false)}
							size="min-w-xl"
						>
							<div className="grid grid-cols-2 gap-4 flex-1 mt-3">
								<div className="col-span-1 space-y-3">
									<div className="space-y-1">
										<Label htmlFor="question">Question</Label>
										<div className="text-lg font-medium">
											{question.question}
										</div>
									</div>
									{question.type === "Multiple" ? (
										<>
											<div className="space-y-1">
												<Label htmlFor="answers">Answers</Label>
												<div className="space-y-1">
													{question.answers?.map((answer, index) => (
														<div
															key={index}
															className="flex items-center gap-x-2"
														>
															<span className="font-medium">
																{String.fromCharCode(65 + index)}.
															</span>
															<span>{answer}</span>
														</div>
													))}
												</div>
											</div>
											<div className="flex items-center gap-x-2">
												<Label htmlFor="question">Result: </Label>
												<div className="text-lg font-medium">
													{question.result}
												</div>
											</div>
										</>
									) : (
										<></>
									)}
								</div>
								<div className="col-span-1">
									<div className="border pt-1.5 pb-2.5 px-3 rounded-md">
										<h2 className="font-semibold italic ">Detail</h2>
										<hr className="my-2" />
										<div className="flex flex-col gap-y-6 px-1">
											<div className="grid grid-cols-2">
												<div className="text-sm text-primary-500 italic font-medium">
													Create by
												</div>
												<div className="flex items-center gap-x-2">
													<div className="flex items-center gap-2">
														<Avatar>
															<AvatarImage
																src={question.createdBy.avatar}
																alt="Avatar"
															/>
															<AvatarFallback>
																{question.createdBy.name}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm font-medium">
															{question.createdBy.name}
														</span>
													</div>
												</div>
											</div>
											<div className="grid grid-cols-2">
												<div className="text-sm text-primary-500 italic font-medium">
													Course
												</div>
												<div className="flex items-center gap-x-2 hover:bg-slate-100">
													<div className="text-sm">{question.course}</div>
												</div>
											</div>
											<div className="grid grid-cols-2">
												<div className="text-sm text-primary-500 italic font-medium">
													Level
												</div>
												<div className="flex items-center gap-x-2">
													<div className="text-sm">{question.level}</div>
												</div>
											</div>
											<div className="grid grid-cols-2">
												<div className="text-sm text-primary-500 italic font-medium">
													Created At
												</div>
												<div className="flex items-center gap-x-2">
													<div className="text-sm">
														{format(
															new Date(question.createdAt),
															"dd/MM/yyyy - HH:mm",
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CustomModal>
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
