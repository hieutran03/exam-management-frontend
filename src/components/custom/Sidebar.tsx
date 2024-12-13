import * as React from "react";
import { useLocation } from "react-router-dom";
import {
	BookOpenCheck,
	Bot,
	FilePenLine,
	GraduationCap,
	MessageCircleQuestion,
} from "lucide-react";

import { NavMain, NavUser } from "@/components/custom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from ".";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Score",
			url: "/",
			icon: FilePenLine,
		},
		{
			title: "Classes",
			url: "/classes",
			icon: Bot,
		},
		{
			title: "Teachers",
			url: "/teachers",
			icon: GraduationCap,
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
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation();
	const navMainWithActive = data.navMain.map((item) => ({
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
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
