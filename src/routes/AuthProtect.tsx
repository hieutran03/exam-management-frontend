import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/context/store";

const AuthProtect = ({ children }: { children: React.ReactNode }) => {
	const auth = useSelector((state: RootState) => state.auth);
	function IsAuthenticated() {
		console.log(auth.user);
		if (auth.user) {
			return true;
		}
		return false;
	}
	if (IsAuthenticated()) {
		return <div>{children}</div>;
	} else {
		return <Navigate to="/auth/login" />;
	}
};

export default AuthProtect;
