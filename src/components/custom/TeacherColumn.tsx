import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronsUpDown, Trash, Info } from "lucide-react";
import { Permission, Teacher, User } from "@/interface";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import customAxios from "@/lib/customAxios";

export const columnsTeacher: ColumnDef<Teacher>[] = [
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
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-full font-medium truncate">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "username",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Username
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium truncate">
				{row.getValue("username")}
			</div>
		),
	},
	{
		accessorKey: "role",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Role
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium truncate">
				{row.original.role_name}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const ActionCell = () => {
				const teacher = row.original;
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

				const handleDelete = async () => {
					try {
						const response = await customAxios.delete(
							`/teachers/${teacher.id}`,
						);

						if (response.status === 204) {
							toast.success("Teacher deleted successfully!");
							navigate("/teachers");
						}
					} catch (error: any) {
						console.log(error.message);
						toast.error("Failed to delete teacher!");
					}
				};

				return (
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
									navigator.clipboard.writeText(teacher.id.toString())
								}
							>
								Copy ID
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate(`/teachers/${teacher.id}`)}
								className="flex items-center gap-x-1 cursor-pointer"
							>
								<Info className="h-4 w-4" />
								<span>Details</span>
							</DropdownMenuItem>
							{isTeacherModify && (
								<>
									<hr className="my-1" />
									<DropdownMenuItem
										onClick={handleDelete}
										className="flex items-center gap-x-1 text-red-500 hover:!text-red-700 cursor-pointer"
									>
										<Trash className="h-4 w-4" />
										<span>Delete</span>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
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
