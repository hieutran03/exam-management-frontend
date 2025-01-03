import { Icons } from "@/lib/icon";

const Loading = () => {
	return (
		<div className="flex justify-center items-center h-screen z-999">
			<Icons.spinner className="animate-spin w-12 h-12 " />
		</div>
	);
};

export default Loading;
