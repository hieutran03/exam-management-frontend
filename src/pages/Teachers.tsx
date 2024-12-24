import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icon";
import { Separator } from "@radix-ui/react-separator";
import {
	Check,
	ChevronsUpDown,
	Ellipsis,
	ShieldPlus,
	UserPlus,
} from "lucide-react";
import { CustomModal, TeacherTable } from "@/components/custom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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
import { Role, Permission, Teacher } from "@/interface";
import customAxios from "@/lib/customAxios";
import { useSelector } from "react-redux";

import { RootState } from "@/context/store";
import { cn } from "@/lib/utils";
import { NavigateFunction, useNavigate } from "react-router-dom";

const Teachers = () => {
	const [openModalRole, setOpenModalRole] = useState<boolean>(false);
	const [openModalTeacher, setOpenModalTeacher] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);

	const navigate: NavigateFunction = useNavigate();

	useEffect(() => {
		const getRoles = async () => {
			try {
				const response = await customAxios.get("/roles");

				if (response.status === 200) {
					setRoles(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getRoles();
	}, []);

	const isTeacherModify = user?.role.permissions.includes(
		Permission.TEACHER_MODIFY,
	);

	useEffect(() => {
		const getTeachers = async () => {
			try {
				const response = await customAxios.get("/teachers");

				if (response.status === 200) {
					setTeachers(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getTeachers();
	}, []);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Teachers</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								10 teachers
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					{isTeacherModify && (
						<>
							<Button onClick={() => setOpenModalRole(true)} variant="ghost">
								<ShieldPlus className="w-5 h-5" />
								Role
							</Button>
							<Button onClick={() => setOpenModalTeacher(true)} variant="ghost">
								<UserPlus className="w-5 h-5" />
								Teacher
							</Button>
						</>
					)}
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="grid grid-cols-4 gap-10">
				<div className="col-span-3">
					<TeacherTable data={teachers} />
				</div>
				<div className="col-span-1 px-4 mt-8">
					<Command className="border rounded-md">
						<CommandInput placeholder="Search roles..." />
						<CommandList>
							<CommandEmpty>No roles found.</CommandEmpty>
							<CommandGroup heading="Roles">
								{roles.map((role) => (
									<CommandItem key={role.id} className="cursor-pointer">
										<div onClick={() => navigate(`/teachers/role/${role.id}`)}>
											{role.name}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			</div>

			<ModalRole open={openModalRole} onClose={() => setOpenModalRole(false)} />
			<ModalTeacher
				open={openModalTeacher}
				onClose={() => setOpenModalTeacher(false)}
				roles={roles}
			/>
		</div>
	);
};

export default Teachers;

const ModalRole = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const [roleName, setRoleName] = useState<string>("");
	const permissions = Object.values(Permission);

	const togglePermission = (permission: string) => {
		setSelectedPermissions((prev) => {
			let newPermissions = prev.includes(permission)
				? prev.filter((p) => p !== permission)
				: [...prev, permission];

			if (
				permission.includes("MODIFY") &&
				!newPermissions.includes(permission.replace("MODIFY", "READ"))
			) {
				newPermissions = [
					...newPermissions,
					permission.replace("MODIFY", "READ"),
				];
			}

			return newPermissions;
		});
	};

	const isReadPermission = (permission: string) => {
		return (
			permission.includes("READ") &&
			selectedPermissions.includes(permission.replace("READ", "MODIFY"))
		);
	};

	const addRole = async () => {
		try {
			if (roleName === "") {
				throw new Error("Please enter role name");
			}
			if (selectedPermissions.length === 0) {
				throw new Error("Please select at least one permission");
			}

			const role = {
				name: roleName,
				permissions: selectedPermissions.map((permission) =>
					permission.replace(/ /g, "_"),
				),
			};

			const response = await customAxios.post("/roles", role);

			if (response.status === 201) {
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<CustomModal size="w-[450px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Role</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">Role Name</Label>
						<Input
							defaultValue={roleName}
							onChange={(e) => setRoleName(e.target.value)}
							type="text"
							id="firstName"
							placeholder="Enter role name"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{permissions
							.map((permission) => permission.replace(/_/g, " "))
							.map((permission) => (
								<div
									key={permission}
									onClick={() =>
										!isReadPermission(permission) &&
										togglePermission(permission)
									}
									className={`flex h-9 items-center justify-center rounded-md border-2 ${
										selectedPermissions.includes(permission)
											? "border-blue-500"
											: "border-muted"
									} bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
										isReadPermission(permission)
											? "pointer-events-none opacity-50"
											: ""
									}`}
								>
									{permission}
								</div>
							))}
					</div>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addRole}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};

const ModalTeacher = ({
	open,
	onClose,
	roles,
}: {
	open: boolean;
	onClose: () => void;
	roles: Role[];
}) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<number>(1);
	const [teacherName, setTeacherName] = useState<string>("");
	const [teacherUsername, setTeacherUsername] = useState<string>("");
	const [teacherPassword, setTeacherPassword] = useState<string>("");

	const addTeacher = async () => {
		try {
			if (teacherName === "") {
				throw new Error("Please enter teacher name");
			}

			if (teacherUsername === "") {
				throw new Error("Please enter teacher username");
			}

			if (teacherPassword === "") {
				throw new Error("Please enter teacher password");
			}

			const teacher = {
				name: teacherName,
				username: teacherUsername,
				password: teacherPassword,
				role_id: selectedRole,
			};

			const response = await customAxios.post("/teachers", teacher);

			if (response.status === 201) {
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<CustomModal size="w-[450px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Teacher</h2>
				<hr className="my-1" />
				<div className="space-y-2">
					<div className="flex items-center justify-center gap-x-8">
						<div className="space-y-2 w-full">
							<Label htmlFor="name">Name</Label>
							<Input
								defaultValue={teacherName}
								onChange={(e) => setTeacherName(e.target.value)}
								type="text"
								id="name"
								placeholder="Enter teacher name"
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label>Role</Label>
							<Popover open={visible} onOpenChange={setVisible}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="flex justify-between w-full"
									>
										{selectedRole
											? roles.find((role) => role.id === selectedRole)?.name
											: "Select role"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0 z-999">
									<Command>
										<CommandInput placeholder="Search roles..." />
										<CommandList>
											<CommandEmpty>No roles found.</CommandEmpty>
											<CommandGroup heading="Roles">
												{roles.map((role) => (
													<CommandItem
														key={role.id}
														onSelect={() => {
															setSelectedRole(role.id);
															setVisible(false);
														}}
													>
														{role.name}
														<Check
															className={cn(
																"ml-auto",
																selectedRole === role.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							defaultValue={teacherUsername}
							onChange={(e) => setTeacherUsername(e.target.value)}
							type="text"
							id="username"
							placeholder="Enter teacher username"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							defaultValue={teacherPassword}
							onChange={(e) => setTeacherPassword(e.target.value)}
							type="text"
							id="password"
							placeholder="Enter teacher password"
						/>
					</div>

					<div className="w-full flex items-center justify-end">
						<Button onClick={addTeacher}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
