"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	LogOut,
	Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import customAxios from "@/lib/customAxios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { logout } from "@/context/services/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";

export function NavUser() {
	const { isMobile } = useSidebar();
	const user = useSelector((state: RootState) => state.auth.user);
	const dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = async () => {
		try {
			await customAxios.post("/auth/logout");
			dispatch(logout());
			navigate("/auth/login");
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent border- data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={""} alt={user?.name} />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user?.name}</span>
								<span className="truncate text-xs">
									{user?.username}@example.com
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={""} alt={user?.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user?.name}</span>
									<span className="truncate text-xs">
										{user?.username}@example.com
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
