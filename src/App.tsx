import { Routes, Route } from "react-router-dom";
import {
	Home,
	Exams,
	Login,
	Register,
	NotFound,
	Questions,
	Teachers,
	TeacherDetail,
	RoleDetail,
	QuestionDetail,
	ExamDetail,
} from "@/pages";
import { DefaultLayout } from "@/layout";
import { AuthProtect } from "@/routes";

function App() {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route
				path="/"
				element={
					<AuthProtect>
						<DefaultLayout />
					</AuthProtect>
				}
			>
				<Route index element={<Home />} />
				<Route path="/teachers" element={<Teachers />} />
				<Route path="/teachers/:teacherId" element={<TeacherDetail />} />
				<Route path="/teachers/role/:roleId" element={<RoleDetail />} />
				<Route path="/exams" element={<Exams />} />
				<Route path="/exams/:examId" element={<ExamDetail />} />
				<Route path="/questions" element={<Questions />} />
				<Route path="/questions/:questionId" element={<QuestionDetail />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
