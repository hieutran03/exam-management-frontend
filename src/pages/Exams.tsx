import { CustomModal, ExamTable } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Exam, Permission, Question, User } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Ellipsis, FilePlus2 } from "lucide-react";
import { useEffect, useState } from "react";

const Exams = () => {
	const [exams, setExams] = useState<Exam[]>([]);
	const [openModalExam, setOpenModalExam] = useState<boolean>(false);
	const [parameters, setParameters] = useState<
		{ id: number; name: string; value: number }[]
	>([]);
	const [user, setUser] = useState<User>({
		id: 0,
		name: "",
		username: "",
		role: {
			id: 0,
			name: "",
			permissions: [],
		},
	});

	useEffect(() => {
		const getExams = async () => {
			try {
				const s = await customAxios.get("/auth/my-profile");

				setUser({
					id: s.data.id,
					name: s.data.name,
					username: s.data.username,
					role: {
						id: s.data.rolePermission.id,
						name: s.data.rolePermission.name,
						permissions: s.data.rolePermission.permissions,
					},
				});

				const url = s.data.rolePermission.permissions.includes(
					Permission.EXAM_READ,
				)
					? "/exams"
					: "/my-exams";

				const response = await customAxios.get(url);

				if (response.status === 200) {
					const formattedExams: Exam[] = response.data.map((exam: any) => ({
						id: exam.id,
						examDate: exam.exam_date,
						course: exam.course,
						teacher: exam.teacher,
						time: exam.time,
					}));

					setExams(formattedExams);
				}
			} catch (error: any) {
				console.error(error);
			}
		};

		const getParameters = async () => {
			try {
				const response = await customAxios.get("/parameter");

				if (response.status === 200) {
					setParameters(response.data);
				}
			} catch (error: any) {
				console.error(error);
			}
		};

		getExams();
		getParameters();
	}, []);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Exams</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{exams.length} exams
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button onClick={() => setOpenModalExam(true)} variant="ghost">
						<FilePlus2 className="w-5 h-5" />
						Exam
					</Button>
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<ExamTable data={exams} />

			<ModalExams
				open={openModalExam}
				onClose={() => setOpenModalExam(false)}
				user={user}
				parameters={parameters}
			/>
		</div>
	);
};

export default Exams;

const ModalExams = ({
	open,
	onClose,
	user,
	parameters,
}: {
	open: boolean;
	onClose: () => void;
	user: User;
	parameters: { id: number; name: string; value: number }[];
}) => {
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

	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedSemester, setSelectedSemester] = useState<number>(0);
	const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
	const [examDate, setExamDate] = useState<string>("");
	const [examTime, setExamTime] = useState<number>();

	const [visibleCourses, setVisibleCourses] = useState<boolean>(false);
	const [visibleSemesters, setVisibleSemesters] = useState<boolean>(false);
	const [visibleQuestions, setVisibleQuestions] = useState<boolean>(false);

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
				const url = user.role.permissions.includes(Permission.QUESTION_READ)
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
	}, [selectedCourse, user.role.permissions]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				visibleQuestions &&
				event.target instanceof Node &&
				!(event.target as Element).closest(".role-dropdown")
			) {
				setVisibleQuestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [visibleQuestions]);

	const handleSelectQuestion = (id: number) => {
		setSelectedQuestions((prev) => {
			if (prev.includes(id)) {
				return prev.filter((q) => q !== id);
			} else {
				return [...prev, id];
			}
		});
	};

	const addExam = async () => {
		try {
			if (!examDate || !examTime || !selectedCourse || !selectedSemester) {
				toast.error("Please fill all fields.");
				return;
			}

			if (selectedQuestions.length === 0) {
				toast.error("Please select at least one question.");
				return;
			}

			const maxExamQuestion = parameters.find(
				(p) => p.name === "max_exam_question",
			);
			if (maxExamQuestion && selectedQuestions.length > maxExamQuestion.value) {
				toast.error(
					`You can select a maximum of ${maxExamQuestion.value} questions.`,
				);
				return;
			}

			const maxExamTime = parameters.find((p) => p.name === "max_exam_time");
			const minExamTime = parameters.find((p) => p.name === "min_exam_time");

			if (maxExamTime && examTime > maxExamTime.value) {
				toast.error(`Maximum exam time is ${maxExamTime.value} minutes.`);
				return;
			}

			if (minExamTime && examTime < minExamTime.value) {
				toast.error(`Minimum exam time is ${minExamTime.value} minutes.`);
				return;
			}

			const response = await customAxios.post("/exams", {
				exam_date: examDate,
				time: examTime,
				total_score: 10,
				course_id: selectedCourse,
				semester_school_year_id: selectedSemester,
				question_ids: selectedQuestions,
			});

			if (response.status === 201) {
				onClose();
				toast.success("Exam added successfully.");
			}
		} catch (error: any) {
			console.error(error);
			toast.error("An error occurred.");
		}
	};

	return (
		<CustomModal size="w-[550px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Exams</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="flex items-center gap-x-4">
						<div className="space-y-2 w-full">
							<Label>Course</Label>
							<Popover open={visibleCourses} onOpenChange={setVisibleCourses}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="flex justify-between w-full"
									>
										{selectedCourse
											? courses.find((course) => course.id === selectedCourse)
													?.name
											: "Select course"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0 z-999">
									<Command>
										<CommandInput placeholder="Search courses..." />
										<CommandList>
											<CommandEmpty>No courses found.</CommandEmpty>
											<CommandGroup heading="Courses">
												{courses.map((course) => (
													<CommandItem
														key={course.id}
														onSelect={() => {
															setSelectedCourse(course.id);
															setSelectedQuestions([]);
															setVisibleCourses(false);
														}}
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
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2 w-full">
							<Label>Semesters</Label>
							<Popover
								open={visibleSemesters}
								onOpenChange={setVisibleSemesters}
							>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="flex justify-between w-full"
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
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0 z-999">
									<Command>
										<CommandInput placeholder="Search semester..." />
										<CommandList>
											<CommandEmpty>No semesters found.</CommandEmpty>
											<CommandGroup
												heading="Courses"
												className="max-h-[200px] overflow-y-auto"
											>
												{semesters.map((semester) => (
													<CommandItem
														key={semester.id}
														onSelect={() => {
															setSelectedSemester(semester.id);
															setVisibleSemesters(false);
														}}
													>
														Semester {semester.semester} {semester.first_year}-
														{semester.second_year}
														<Check
															className={cn(
																"ml-auto",
																selectedSemester === semester.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="flex flex-col space-y-2 w-full relative">
						<Label>Question</Label>
						<Button
							onClick={() => setVisibleQuestions(true)}
							variant="outline"
							disabled={!selectedCourse}
						>
							Select questions
						</Button>
						{visibleQuestions && (
							<div className="absolute max-h-[150px] overflow-y-auto top-[55px] z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
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
								value={examDate}
								onChange={(e) => setExamDate(e.target.value)}
								type="date"
								id="examDate"
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label htmlFor="examTime">Exam Time</Label>
							<Input
								type="number"
								defaultValue={examTime}
								onChange={(e) => setExamTime(parseInt(e.target.value))}
								id="examTime"
							/>
						</div>
					</div>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addExam}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
