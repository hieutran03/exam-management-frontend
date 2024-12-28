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
	Classes,
	ClassDetail,
	ScoreDetail,
	Report,
	ReportDetail,
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
				<Route path=":examId" element={<ScoreDetail />} />
				<Route path="/teachers" element={<Teachers />} />
				<Route path="/teachers/:teacherId" element={<TeacherDetail />} />
				<Route path="/teachers/role/:roleId" element={<RoleDetail />} />
				<Route path="/exams" element={<Exams />} />
				<Route path="/exams/:examId" element={<ExamDetail />} />
				<Route path="/classes" element={<Classes />} />
				<Route path="/classes/:classId/:courseId" element={<ClassDetail />} />
				<Route path="/reports" element={<Report />} />
				<Route path="/reports/:reportId" element={<ReportDetail />} />
				<Route path="/questions" element={<Questions />} />
				<Route path="/questions/:questionId" element={<QuestionDetail />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
