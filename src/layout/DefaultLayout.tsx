import { Header, Sidebar } from "@/components/custom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
const DefaultLayout = () => {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				<Header />
				<div className="h-full">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DefaultLayout;
