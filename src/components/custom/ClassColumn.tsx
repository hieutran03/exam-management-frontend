import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronsUpDown, Trash, Info } from "lucide-react";
import { Class, Permission, User } from "@/interface";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import customAxios from "@/lib/customAxios";

export const columnsClass: ColumnDef<Class>[] = [
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
		accessorKey: "class_id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					ID
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-full font-medium truncate">{row.original.class_id}</div>
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
				{row.original.course_name}
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
				const classObj = row.original;
				const navigate: NavigateFunction = useNavigate();

				const [user, setUser] = useState<User>({
					id: 0,
					name: "",
					username: "",
					role: {
						id: 0,
						name: "",
						permissions: [],
					},
				});

				useEffect(() => {
					const getUser = async () => {
						try {
							const response = await customAxios.get("/auth/my-profile");

							if (response.status === 200) {
								setUser({
									id: response.data.id,
									name: response.data.name,
									username: response.data.username,
									role: {
										id: response.data.rolePermission.id,
										name: response.data.rolePermission.name,
										permissions: response.data.rolePermission.permissions,
									},
								});
							}
						} catch (error: any) {
							console.log(error.message);
						}
					};

					getUser();
				}, []);
				const isTeacherModify: boolean = user.role.permissions.includes(
					Permission.TEACHER_MODIFY,
				);

				return (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									disabled={!isTeacherModify}
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
										navigator.clipboard.writeText(classObj.class_id)
									}
								>
									Copy ID
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										navigate(
											`/classes/${classObj.class_id}/${classObj.course_id}`,
										)
									}
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
