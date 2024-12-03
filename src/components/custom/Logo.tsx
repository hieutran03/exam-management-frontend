import { Link } from "react-router-dom";
import { Icons } from "@/lib/icon";

const Logo = () => {
	return (
		<Link to="/">
			<div className="hover:opacity-75 transition items-center justify-center gap-x-2 flex">
				<Icons.logo className="h-8 w-8" />
				<p className=" text-xl pb-1 font-medium">Exam Management</p>
			</div>
		</Link>
	);
};

export default Logo;
