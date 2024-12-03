import { NavNotify, DarkModeButton } from "@/components/custom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
	return (
		<header className="sticky top-0 z-99 flex w-full bg-background shadow-sm shadow-slate-200 dark:shadow-slate-800">
			<div className="flex flex-grow items-center justify-between py-3 px-4 shadow-2 md:px-6 2xl:px-11">
				<SidebarTrigger />
				<div className="flex items-center gap-x-3">
					<DarkModeButton />

					<NavNotify />
				</div>
			</div>
		</header>
	);
};

export default Header;
