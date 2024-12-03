import { type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild isActive={item.isActive}>
							<a href={item.url} className="!h-10">
								<item.icon className="!size-5" />
								<span className="text-base">{item.title}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
