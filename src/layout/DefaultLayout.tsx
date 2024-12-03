import { Header, Sidebar } from "@/components/custom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
const DefaultLayout = () => {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				<Header />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DefaultLayout;
