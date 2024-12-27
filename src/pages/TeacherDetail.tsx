import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { update } from "@/context/services/auth";
import { RootState } from "@/context/store";
import { Permission, Role, User } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { Check, Ellipsis, X } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const TeacherDetail = () => {
	const [teacher, setTeacher] = useState<User>({
		id: 0,
		name: "",
		username: "",
		role: {
			id: 0,
			name: "",
			permissions: [],
		},
	});
	const [roles, setRoles] = useState<Role[]>([]);
	const [teacherName, setTeacherName] = useState<string>("");
	const [visible, setVisible] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const inputRef = useRef<ElementRef<"input">>(null);
	const { teacherId } = useParams<{ teacherId: string }>();
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

	const currentUser = useSelector((state: RootState) => state.auth.user);
	const dispatch = useDispatch();

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

		const getTeacherDetail = async () => {
			try {
				const response = await customAxios.get(
					`/teachers/${teacherId}/details`,
				);

				if (response.status === 200) {
					setTeacher({
						id: response.data.id,
						name: response.data.name,
						username: response.data.username,
						role: {
							id: response.data.role_id,
							name: response.data.role_name,
							permissions: response.data.rolePermission.permissions,
						},
					});

					setTeacherName(response.data.name);
				}
			} catch (error: any) {
				console.error(error);
			}
		};

		getTeacherDetail();
	}, [teacherId]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				visible &&
				event.target instanceof Node &&
				!(event.target as Element).closest(".role-dropdown")
			) {
				setVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [visible]);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		});
	};
	const disableEditing = () => {
		setIsEditing(false);
	};

	const handleRoleChange = async (roleId: number) => {
		try {
			const response = await customAxios.patch(`/teachers/${teacherId}`, {
				role_id: roleId,
			});

			if (response.status === 200) {
				setTeacher(
					(prev) =>
						prev && {
							...prev,
							role: {
								...prev.role,
								name: response.data.rolePermission.name,
								permissions: response.data.rolePermission.permissions,
							},
						},
				);
				if (currentUser.id === teacher.id) {
					dispatch(
						update({
							user: {
								id: currentUser.id,
								name: currentUser.name,
								username: currentUser.username,
								role: {
									id: response.data.rolePermission.id,
									name: response.data.rolePermission.name,
									permissions: response.data.rolePermission.permissions,
								},
							},
						}),
					);
				}
				setVisible(false);
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleNameChange = async (name: string) => {
		try {
			const response = await customAxios.patch(`/teachers/${teacherId}`, {
				name,
			});

			if (response.status === 200) {
				setTeacher((prev) => prev && { ...prev, name });
				if (currentUser?.id === teacher.id) {
					dispatch(
						update({
							user: {
								id: currentUser.id,
								name,
								username: currentUser.username,
								role: {
									id: currentUser.role.id,
									name: currentUser.role.name,
									permissions: currentUser.role.permissions,
								},
							},
						}),
					);
				}
				setIsEditing(false);
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	const isTeacherModify: boolean = user.role.permissions.includes(
		Permission.TEACHER_MODIFY,
	);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Teacher Detail</p>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="flex flex-col gap-y-4">
				<Card className="sm:mx-auto sm:w-full sm:max-w-md">
					<CardHeader className="space-y-1">
						<CardDescription className="text-center text-xl font-bold tracking-tight text-gray-700 ">
							Teacher Details
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 py-2">
						<div className="flex flex-col gap-y-2">
							<Label className="text-base font-medium italic">
								Teacher Username
							</Label>

							<div className="text-sm h-10 px-4 py-2 font-medium">
								{teacher?.username}
							</div>
						</div>
						<div className="flex flex-col gap-y-2">
							<Label className="text-base font-medium italic">
								Teacher Name
							</Label>
							{isEditing ? (
								<div className="rounded-md bg-white relative">
									<Input
										ref={inputRef}
										defaultValue={teacher?.name}
										onChange={(e) => setTeacherName(e.target.value)}
										type="text"
										name="inputValue"
										className="p-[11px] rounded-md border border-gray-300 focus-visible:outline-none"
									/>
									<div className="absolute top-12 right-0 z-99 -bottom-7 flex items-center gap-x-1">
										<Button
											onClick={disableEditing}
											variant={"outline"}
											className="size-7"
										>
											<X className="w-5 h-5" />
										</Button>
										<Button
											onClick={() => handleNameChange(teacherName)}
											variant={"outline"}
											className="size-7"
										>
											<Check className="w-5 h-5" />
										</Button>
									</div>
								</div>
							) : (
								<Button
									disabled={!isTeacherModify}
									onClick={enableEditing}
									variant={"ghost"}
									className="justify-start"
								>
									{teacher?.name}
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-y-2 relative">
							<Label className="text-base font-medium italic">
								Teacher Role
							</Label>

							<Button
								disabled={!isTeacherModify}
								onClick={() => {
									setVisible(!visible);
								}}
								variant={"ghost"}
								className="justify-start"
							>
								{teacher?.role.name}
							</Button>

							{visible && (
								<div className="absolute top-[75px] z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
									{roles
										.filter((role) => role.name !== teacher?.role.name)
										.map((role) => (
											<div
												className="font-medium italic px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-md"
												key={role.id}
												onClick={() => handleRoleChange(role.id)}
											>
												{role.name}
											</div>
										))}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-y-2 relative">
							<Label className="text-base font-medium italic">
								Permissions
							</Label>

							<div className="flex flex-wrap gap-x-1">
								{teacher?.role.permissions.map((permission) => (
									<div
										className="text-sm h-10 px-4 py-2 font-medium"
										key={permission}
									>
										{permission.replace(/_/g, " ")}
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default TeacherDetail;
