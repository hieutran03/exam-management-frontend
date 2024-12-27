import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Exam, Permission, Question } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { formatDate, parseISO } from "date-fns";
import { Check, CircleHelp, Edit, Ellipsis, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ExamDetail = () => {
	const { examId } = useParams<{ examId: string }>();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [exam, setExam] = useState<Exam>({
		id: "",
		examDate: "",
		time: 0,
		totalScore: 0,
		course: "",
		title: "",
		teacher: "",
		questions: [],
	});

	const [visibleCourses, setVisibleCourses] = useState<boolean>(false);
	const [visibleSemesters, setVisibleSemesters] = useState<boolean>(false);
	const [visibleQuestions, setVisibleQuestions] = useState<boolean>(false);

	const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
	const [semesters, setSemesters] = useState<
		{
			id: number;
			semester: number;
			first_year: string;
			second_year: string;
		}[]
	>([]);
	const [questions, setQuestions] = useState<Question[]>([]);

	const [selectedSemester, setSelectedSemester] = useState<number>(0);
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

	useEffect(() => {
		const getQuestionDetail = async () => {
			try {
				const s = await customAxios.get("/auth/my-profile");

				const url = s.data.rolePermission.permissions.includes(
					Permission.EXAM_MODIFY,
				)
					? "/exams"
					: "/my-exams";

				const response = await customAxios.get(`${url}/${examId}`);

				if (response.status === 200) {
					setExam({
						id: response.data.id,
						examDate: response.data.exam_date,
						course: response.data.course,
						teacher: response.data.teacher,
						time: response.data.time,
						totalScore: response.data.total_score,
						questions: response.data.questions,
						title: response.data.title,
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getQuestionDetail();
	}, [examId]);

	useEffect(() => {
		const getCourses = async () => {
			try {
				const response = await customAxios.get("/courses");

				if (response.status === 200) {
					setCourses(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		const getSemester = async () => {
			try {
				const response = await customAxios.get("/semesters");

				if (response.status === 200) {
					setSemesters(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getCourses();
		getSemester();
	}, []);

	useEffect(() => {
		const getQuestions = async () => {
			try {
				const user = await customAxios.get("/auth/my-profile");

				const url = user.data.rolePermission.permissions.includes(
					Permission.QUESTION_READ,
				)
					? "/questions"
					: "/my-questions";

				const response = await customAxios.get(
					`${url}?course_id=${selectedCourse}`,
				);

				if (response.status === 200) {
					const formattedQuestions: Question[] = response.data.map(
						(q: any) => ({
							id: q.id,
							content: q.content,
							course: q.course_name,
							level: q.question_level_name,
							teacher: q.teacher_name,
						}),
					);
					setQuestions(formattedQuestions);
				}
			} catch (error: any) {
				console.error(error);
			}
		};

		getQuestions();
	}, [selectedCourse]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				visibleQuestions &&
				event.target instanceof Node &&
				!(event.target as Element).closest(".role-dropdown")
			) {
				setVisibleQuestions(false);
			}

			if (
				visibleCourses &&
				event.target instanceof Node &&
				!(event.target as Element).closest(".role-dropdown")
			) {
				setVisibleCourses(false);
			}

			if (
				visibleSemesters &&
				event.target instanceof Node &&
				!(event.target as Element).closest(".role-dropdown")
			) {
				setVisibleSemesters(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [visibleQuestions, visibleCourses, visibleSemesters]);

	const handleSelectQuestion = (id: number) => {
		setSelectedQuestions((prev) => {
			if (prev.includes(id)) {
				return prev.filter((q) => q !== id);
			} else {
				return [...prev, id];
			}
		});
	};

	const handleSave = async () => {
		try {
			const user = await customAxios.get("/auth/my-profile");

			const url = user.data.rolePermission.permissions.includes(
				Permission.QUESTION_MODIFY,
			)
				? "/exams"
				: "/my-exams";

			const response = await customAxios.put(`${url}/${examId}`, {
				exam_date: exam.examDate,
				time: exam.time,
				total_score: 10,
				course_id: selectedCourse,
				semester_school_year_id: selectedSemester,
				question_ids: selectedQuestions,
			});

			if (response.status === 200) {
				setIsEditing(false);
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Exam Detail</p>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					{isEditing ? (
						<Button
							onClick={() => setIsEditing(false)}
							variant={"ghost"}
							size={"icon"}
						>
							<X className="w-5 h-5" />
						</Button>
					) : (
						<Button
							onClick={() => setIsEditing(true)}
							variant={"ghost"}
							size={"icon"}
						>
							<Edit className="w-5 h-5" />
						</Button>
					)}
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			{isEditing ? (
				<Card className="sm:mx-auto sm:w-full sm:max-w-2xl flex flex-col gap-4 ">
					<CardHeader className="space-y-1 relative flex justify-center items-center">
						<CardTitle className="text-2xl font-bold tracking-tight text-center">
							Edit Exam
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 py-2">
						<div className="flex items-center gap-x-4">
							<div className="flex flex-col gap-y-2 w-full relative">
								<Label>Course</Label>
								<Button
									onClick={() => {
										setVisibleCourses(!visibleCourses);
									}}
									variant={"ghost"}
									className="justify-start"
								>
									{exam.course ? exam.course : "Select Course"}
								</Button>
								{visibleCourses && (
									<div className="absolute top-[65px] max-h-[136px] overflow-y-auto z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
										{courses.map((course) => (
											<div
												onClick={() => {
													setSelectedCourse(course.id);
													setSelectedQuestions([]);
													setVisibleCourses(false);
													setExam((prev) => ({
														...prev,
														course: course.name,
													}));
												}}
												className="font-medium flex items-center gap-x-2 italic px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-md"
												key={course.id}
											>
												{course.name}
												<Check
													className={cn(
														"ml-auto",
														selectedCourse === course.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</div>
										))}

										{courses.length === 0 && (
											<div className="text-center italic font-medium text-gray-500">
												No courses found.
											</div>
										)}
									</div>
								)}
							</div>
							<div className="flex flex-col gap-y-2 w-full relative">
								<Label>Semesters</Label>
								<Button
									onClick={() => {
										setVisibleSemesters(!visibleSemesters);
									}}
									variant={"ghost"}
									className="justify-start"
								>
									{selectedSemester
										? "Semester " +
										  semesters.find(
												(semester) => semester.id === selectedSemester,
										  )?.semester +
										  " " +
										  semesters.find(
												(semester) => semester.id === selectedSemester,
										  )?.first_year +
										  "-" +
										  semesters.find(
												(semester) => semester.id === selectedSemester,
										  )?.second_year
										: "Select semester"}
								</Button>
								{visibleSemesters && (
									<div className="absolute top-[65px] max-h-[96px] overflow-y-auto z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
										{semesters.map((semester) => (
											<div
												onClick={() => {
													setSelectedSemester(semester.id);
													setVisibleSemesters(false);
												}}
												className="font-medium flex items-center gap-x-2 italic px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-md"
												key={semester.id}
											>
												Semester {semester.semester} - {semester.first_year} /{" "}
												{semester.second_year}
												<Check
													className={cn(
														"ml-auto",
														selectedSemester === semester.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</div>
										))}

										{semesters.length === 0 && (
											<div className="text-center italic font-medium text-gray-500">
												No semesters found.
											</div>
										)}
									</div>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-y-2 w-full relative">
							<Label>Question</Label>
							<Button
								onClick={() => {
									setVisibleQuestions(!visibleQuestions);
								}}
								variant={"ghost"}
								className="justify-start"
							>
								Select Questions
							</Button>
							{visibleQuestions && (
								<div className="absolute top-[65px] max-h-[96px] overflow-y-auto z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
									{questions.map((question) => (
										<div
											onClick={() => handleSelectQuestion(question.id)}
											className="font-medium flex items-center gap-x-2 italic px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-md"
											key={question.id}
										>
											{question.content}

											<Check
												className={cn(
													"ml-auto",
													selectedQuestions.includes(question.id)
														? "opacity-100"
														: "opacity-0",
												)}
											/>
										</div>
									))}
									{questions.length === 0 && (
										<div className="text-center italic font-medium text-gray-500">
											No questions found.
										</div>
									)}
								</div>
							)}
						</div>
						<div className="flex items-center gap-x-4">
							<div className="space-y-2 w-full">
								<Label htmlFor="examDate">Exam Date</Label>
								<Input
									defaultValue={formatDate(
										parseISO(exam.examDate),
										"yyyy-MM-dd",
									)}
									onChange={(e) =>
										setExam({ ...exam, examDate: e.target.value })
									}
									type="date"
									id="examDate"
								/>
							</div>
							<div className="space-y-2 w-full">
								<Label htmlFor="examTime">Exam Time</Label>
								<Input
									defaultValue={exam.time.toString()}
									onChange={(e) =>
										setExam({ ...exam, time: parseInt(e.target.value) })
									}
									type="number"
									id="examTime"
								/>
							</div>
						</div>
						<div className="w-full flex items-center justify-end">
							<Button onClick={handleSave}>Save</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card className="sm:mx-auto sm:w-full sm:max-w-2xl min-h-screen flex flex-col">
					<CardHeader className="space-y-1 relative flex justify-center items-center">
						<CardTitle className="text-2xl font-bold tracking-tight text-center">
							{exam.title}
						</CardTitle>
						<CardDescription className="text-center text-xl font-semibold text-gray-700">
							{exam.course}
						</CardDescription>
						<CardDescription className="text-center text-sm italic font-semibold text-gray-700">
							Time : {exam.time} minutes | Total Score : {exam.totalScore}
						</CardDescription>
					</CardHeader>
					<hr className="mb-4 mx-20" />
					<CardContent className="grid gap-4 py-2">
						<div className="flex items-center gap-x-1 text-base font-semibold text-gray-700">
							<CircleHelp className="w-5 h-5" />
							QUESTIONS
						</div>

						{exam.questions &&
							exam.questions.map(
								(question: { id: number; content: string }, index: number) => (
									<div
										className="flex items-center gap-x-1 font-medium"
										key={index}
									>
										<div className="text-lg">{index + 1}/</div>
										<div className="italic tracking-tight">
											{question.content}
										</div>
									</div>
								),
							)}
					</CardContent>

					<CardFooter className="flex justify-between items-center mt-auto">
						<span className="text-sm font-semibold text-gray-700">
							{exam.examDate
								? formatDate(parseISO(exam.examDate), "dd/MM/yyyy")
								: "N/A"}
						</span>

						<span className="text-sm font-semibold text-gray-700">
							{exam.teacher}
						</span>
					</CardFooter>
				</Card>
			)}
		</div>
	);
};

export default ExamDetail;
