import * as React from "react";
import { useLocation } from "react-router-dom";
import {
	BookOpenCheck,
	Clipboard,
	FilePenLine,
	GraduationCap,
	MessageCircleQuestion,
	Shapes,
} from "lucide-react";

import { NavMain, NavUser } from "@/components/custom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from ".";
import { Permission, User } from "@/interface";
import customAxios from "@/lib/customAxios";
const data = {
	navMain: [
		{
			title: "Score",
			url: "/",
			icon: FilePenLine,
		},
		{
			title: "Exams",
			url: "/exams",
			icon: BookOpenCheck,
		},
		{
			title: "Questions",
			url: "/questions",
			icon: MessageCircleQuestion,
		},
		{
			title: "Reports",
			url: "/reports",
			icon: Clipboard,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation();

	const [user, setUser] = React.useState<User>({
		id: 0,
		name: "",
		username: "",
		role: {
			id: 0,
			name: "",
			permissions: [],
		},
	});

	React.useEffect(() => {
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

	const isTeacherRead: boolean = user.role.permissions.includes(
		Permission.TEACHER_READ,
	);

	const navMainWithActive = data.navMain
		.concat(
			isTeacherRead
				? [
						{
							title: "Teachers",
							url: "/teachers",
							icon: GraduationCap,
						},
						{
							title: "Classes",
							url: "/classes",
							icon: Shapes,
						},
				  ]
				: [],
		)
		.map((item) => ({
			...item,
			isActive: location.pathname === item.url,
		}));

	return (
		<Sidebar {...props} className="p-2">
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent className="mt-10">
				<NavMain items={navMainWithActive} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
