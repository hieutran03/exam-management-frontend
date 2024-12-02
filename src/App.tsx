import { Routes, Route } from "react-router-dom";
import { Home, Login, Register, NotFound } from "@/pages";
import { DefaultLayout } from "@/layout";

function App() {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={<Home />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
