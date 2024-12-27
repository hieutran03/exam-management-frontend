import * as React from "react";
import { useLocation } from "react-router-dom";
import {
	BookOpenCheck,
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

const data = {
	navMain: [
		{
			title: "Score",
			url: "/",
			icon: FilePenLine,
		},
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
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
