import { Routes, Route } from "react-router-dom";
import { Home, Exams, Login, Register, NotFound, Questions,Classes,ClassDetail, TeacherList,TeacherDetail } from "@/pages";
import { DefaultLayout } from "@/layout";


function App() {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={<Home />} />
				<Route path="/exams" element={<Exams />} />
				<Route path="/questions" element={<Questions />} />
				<Route path="/classes" element={<Classes />} />
				<Route path="/classes/:classCode" element={<ClassDetail />} />
				<Route path="/teachers" element={<TeacherList />} />
				<Route path="/teachers/:id" element={<TeacherDetail />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
