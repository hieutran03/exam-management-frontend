import * as React from "react";
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
			url: "#",
			icon: FilePenLine,
			isActive: true,
		},
		{
			title: "Classes",
			url: "#",
			icon: Bot,
		},
		{
			title: "Teachers",
			url: "#",
			icon: GraduationCap,
		},
		{
			title: "Exams",
			url: "#",
			icon: BookOpenCheck,
		},
		{
			title: "Questions",
			url: "#",
			icon: MessageCircleQuestion,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props} className="p-2">
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent className="mt-10">
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
