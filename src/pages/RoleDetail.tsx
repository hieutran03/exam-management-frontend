import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { update } from "@/context/services/auth";
import { RootState } from "@/context/store";
import { Permission, RolePermission, User } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { Edit, Ellipsis, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const RoleDetail = () => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [role, setRole] = useState<RolePermission>({
		id: 0,
		name: "",
		permissions: [],
	});
	const { roleId } = useParams<{ roleId: string }>();
	const permissionsList = Object.values(Permission);
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
		const getRoleDetail = async () => {
			try {
				const s = await customAxios.get("/auth/my-profile");

				setUser({
					id: s.data.id,
					name: s.data.name,
					username: s.data.username,
					role: {
						id: s.data.rolePermission.id,
						name: s.data.rolePermission.name,
						permissions: s.data.rolePermission.permissions,
					},
				});

				const response = await customAxios.get(`/roles/${roleId}`);

				if (response.status === 200) {
					setRole({
						id: response.data.id,
						name: response.data.name,
						permissions: response.data.permissions,
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getRoleDetail();
	}, [roleId]);

	const handlePermissionChange = (permission: string) => {
		if (role.permissions.includes(permission as Permission)) {
			const newPermissions = role.permissions.filter(
				(item) => item !== permission,
			);
			setRole({ ...role, permissions: newPermissions });
		} else {
			setRole({
				...role,
				permissions: [...role.permissions, permission as Permission],
			});
		}
	};

	const handleSave = async () => {
		try {
			const response = await customAxios.put(`/roles/${roleId}`, {
				name: role.name,
				permissions: role.permissions,
			});

			if (response.status === 200) {
				setRole({
					id: response.data.id,
					name: response.data.name,
					permissions: response.data.permissions,
				});
				setIsEditing(false);

				if (currentUser.role.id === response.data.id) {
					dispatch(
						update({
							user: {
								...currentUser,
								role: {
									id: response.data.id,
									name: response.data.name,
									permissions: response.data.permissions,
								},
							},
						}),
					);
				}
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Role</p>
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
					<CardHeader className="space-y-1 relative">
						<CardDescription className="text-center text-xl font-bold tracking-tight text-gray-700 ">
							Role Details
						</CardDescription>
						{user.role.permissions.includes(Permission.TEACHER_MODIFY) && (
							<div className="absolute right-1 top-0">
								{isEditing ? (
									<Button
										onClick={() => setIsEditing(false)}
										variant={"ghost"}
										size={"icon"}
									>
										<X className="w-5 h-5" />
									</Button>
								) : (
									<Button
										onClick={() => setIsEditing(true)}
										variant={"ghost"}
										size={"icon"}
									>
										<Edit className="w-5 h-5" />
									</Button>
								)}
							</div>
						)}
					</CardHeader>
					<CardContent className="grid gap-4 py-2">
						<div className="flex flex-col gap-y-2">
							<Label className="text-base font-medium italic">Role name</Label>

							{isEditing ? (
								<Input
									defaultValue={role.name}
									onChange={(e) => setRole({ ...role, name: e.target.value })}
									type="text"
									name="inputValue"
									className="p-[11px] rounded-md border border-gray-300 focus-visible:outline-none"
								/>
							) : (
								<Button variant={"ghost"} className="justify-start">
									{role.name}
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-y-2 relative">
							<Label className="text-base font-medium italic">
								Permissions
							</Label>

							<div className="flex flex-wrap gap-1">
								{isEditing ? (
									<>
										{permissionsList.map((permission) => (
											<Button
												key={permission}
												variant={"ghost"}
												onClick={() => handlePermissionChange(permission)}
												className={` border-2
													
													${role.permissions.includes(permission) ? "border-blue-500" : "border-muted"}`}
											>
												{permission.replace(/_/g, " ")}
											</Button>
										))}
									</>
								) : (
									<>
										{role.permissions.map((permission) => (
											<Button
												key={permission}
												variant={"ghost"}
												className="justify-start"
											>
												{permission.replace(/_/g, " ")}
											</Button>
										))}
									</>
								)}
							</div>
						</div>
					</CardContent>
					{isEditing && (
						<CardFooter className="flex justify-end">
							<Button onClick={handleSave}>Save</Button>
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	);
};

export default RoleDetail;
