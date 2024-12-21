import { Header, Sidebar } from "@/components/custom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
const DefaultLayout = () => {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				<Header />
				<div className="h-full p-4 md:p-6 xl:p-8">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DefaultLayout;
