import { CustomModal } from "@/components/custom";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Class, Exam } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { formatDate, isValid } from "date-fns";
import { Check, ChevronsUpDown, Ellipsis, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ScoreDetail = () => {
	const { examId } = useParams<{ examId: string }>();
	const [exam, setExam] = useState<Exam>({
		id: 0,
		examDate: "",
		time: 0,
		totalScore: 0,
		course: "",
		teacher: "",
		course_id: 0,
		semester_school_year_id: 0,
	});
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [results, setResults] = useState<
		{
			student_id: number;
			student_name: string;
			class_id: string;
			score: string;
			score_text: string;
			note: string;
		}[]
	>([]);

	useEffect(() => {
		const getExamDetail = async () => {
			try {
				const response = await customAxios.get(`/my-exams/${examId}`);

				if (response.status === 200) {
					setExam({
						id: response.data.id,
						examDate: response.data.exam_date,
						time: response.data.time,
						totalScore: response.data.total_score,
						course: response.data.course,
						teacher: response.data.teacher,
						course_id: response.data.course_id,
						semester_school_year_id: response.data.semester_school_year_id,
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		const getResults = async () => {
			try {
				const response = await customAxios.get(`/my-exams/${examId}/results`);

				if (response.status === 200) {
					const formattedResults: {
						student_id: number;
						student_name: string;
						class_id: string;
						score: string;
						score_text: string;
						note: string;
					}[] = response.data.map((result: any) => ({
						student_id: result.student_id,
						student_name: result.student_name,
						class_id: result.class_id,
						score: result.score,
						score_text: result.score_text,
						note: result.note,
					}));

					setResults(formattedResults);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getResults();
		getExamDetail();
	}, [examId]);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">
							{exam.course} - {exam.teacher}
						</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{isValid(new Date(exam.examDate))
									? formatDate(new Date(exam.examDate), "dd/MM/yyyy")
									: "Invalid date"}{" "}
								- ({exam.time} min)
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button
						onClick={() => setOpenModal(true)}
						variant="ghost"
						size={"icon"}
					>
						<Plus className="w-5 h-5" />
					</Button>
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<TableDemo data={results} exam_id={exam.id} />
			<ModalScore
				open={openModal}
				onClose={() => setOpenModal(false)}
				exam={exam}
			/>
		</div>
	);
};

export default ScoreDetail;

const ModalScore = ({
	open,
	onClose,
	exam,
}: {
	open: boolean;
	onClose: () => void;
	exam: Exam;
}) => {
	const [classes, setClasses] = useState<Class[]>([]);

	const [studentId, setStudentId] = useState<string>("");
	const [studentName, setStudentName] = useState<string>("");
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [score, setScore] = useState<string>("");
	const [scoreText, setScoreText] = useState<string>("");
	const [note, setNote] = useState<string>("");

	const [visibleClasses, setVisibleClasses] = useState<boolean>(false);

	const numberToText = (num: number): string => {
		const ones = [
			"",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const teens = [
			"Ten",
			"Eleven",
			"Twelve",
			"Thirteen",
			"Fourteen",
			"Fifteen",
			"Sixteen",
			"Seventeen",
			"Eighteen",
			"Nineteen",
		];

		if (num < 10) return ones[num];
		if (num < 20) return teens[num - 10];
		if (num < 100) return tens[Math.floor(num / 10)] + ones[num % 10];
		return "";
	};

	useEffect(() => {
		const getClasses = async () => {
			try {
				const response = await customAxios.get(
					`/courses/${exam.course_id}/course-class`,
				);

				if (response.status === 200) {
					const formattedClasses: Class[] = response.data.map((item: any) => ({
						class_id: item.class_id,
						teacher: item.teacher_name,
						course_id: item.course_id,
						course_name: item.course_name,
						semester_school_year_id: item.semester_school_year_id,
					}));

					setClasses(formattedClasses);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getClasses();
	}, [exam.course_id]);

	useEffect(() => {
		setScoreText(numberToText(Number(score)));
		if (score === "") {
			setNote("");
		} else {
			const numberScore = Number(score);
			if (numberScore < exam.totalScore / 2) {
				setNote("Fail");
			} else if (
				numberScore >= exam.totalScore / 2 &&
				numberScore < exam.totalScore
			) {
				setNote("Pass");
			} else {
				setNote("Excellent");
			}
		}
	}, [score, exam.totalScore]);

	const addResult = async () => {
		try {
			if (
				studentId === "" ||
				studentName === "" ||
				selectedClass === "" ||
				score === ""
			) {
				toast.error("Please fill all fields.");
				return;
			}

			if (Number(score) > exam.totalScore) {
				toast.error("Score must be less than total score.");
				return;
			}

			if (
				classes.find((c) => c.class_id === selectedClass)
					?.semester_school_year_id !== exam.semester_school_year_id
			) {
				toast.error("Class is not in the same semester with the exam.");
				return;
			}

			const response = await customAxios.post(`/my-exams/${exam.id}/results`, {
				student_id: Number(studentId),
				student_name: studentName,
				class_id: selectedClass,
				score: Number(score),
				score_text: scoreText,
				note: note,
			});

			if (response.status === 201) {
				toast.success("Add result successfully.");
				onClose();
			}
		} catch (error: any) {
			if (error.response.status === 400) {
				toast.error("Student id is duplicated. Please check again.");
			}
		}
	};

	return (
		<CustomModal size="w-[500px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add new result</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-2 w-full">
							<Label>Student Id</Label>
							<Input
								type="text"
								placeholder="Enter student id"
								value={studentId}
								onChange={(e) => setStudentId(e.target.value)}
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label>Student Name</Label>
							<Input
								type="text"
								placeholder="Enter student name"
								value={studentName}
								onChange={(e) => setStudentName(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-2 w-full">
							<Label>Classes</Label>
							<Popover open={visibleClasses} onOpenChange={setVisibleClasses}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="flex justify-between w-full"
									>
										{selectedClass
											? classes.find((c) => c.class_id === selectedClass)
													?.class_id
											: "Select class"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0 z-999">
									<Command>
										<CommandInput placeholder="Search courses..." />
										<CommandList>
											<CommandEmpty>No classes found.</CommandEmpty>
											<CommandGroup
												heading="Courses"
												className="max-h-[200px] overflow-y-auto space-y-1"
											>
												{classes.map((classO) => (
													<CommandItem
														key={classO.class_id}
														onSelect={() => {
															setSelectedClass(classO.class_id);
															setVisibleClasses(false);
														}}
													>
														{classO.class_id}
														<Check
															className={cn(
																"ml-auto",
																selectedClass === classO.class_id
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
							<Label>Score</Label>
							<Input
								type="number"
								value={score}
								onChange={(e) => setScore(e.target.value)}
								placeholder="Enter score"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-2 w-full">
							<Label>Score Text</Label>
							<Input
								type="text"
								value={scoreText}
								readOnly
								placeholder="Score text"
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label>Note</Label>
							<Input
								type="text"
								value={note}
								readOnly
								placeholder="Score text"
							/>
						</div>
					</div>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addResult}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};

const TableDemo = ({
	data,
	exam_id,
}: {
	data: {
		student_id: number;
		student_name: string;
		class_id: string;
		score: string;
		score_text: string;
		note: string;
	}[];
	exam_id: number;
}) => {
	const deleteResult = async (studentId: number) => {
		try {
			const response = await customAxios.delete(
				`/my-exams/${exam_id}/results/${studentId}`,
			);

			if (response.status === 200) {
				toast.success("Delete result successfully.");
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Student Id</TableHead>
					<TableHead>Student Name</TableHead>
					<TableHead>Class Id</TableHead>
					<TableHead>Score</TableHead>
					<TableHead>Score Text</TableHead>
					<TableHead>Note</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item) => (
					<TableRow key={item.student_id}>
						<TableCell>{item.student_id}</TableCell>
						<TableCell>{item.student_name}</TableCell>
						<TableCell>{item.class_id}</TableCell>
						<TableCell>{item.score}</TableCell>
						<TableCell>{item.score_text}</TableCell>
						<TableCell>{item.note}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="secondary" size={"icon"}>
										<Ellipsis className="w-5 h-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => deleteResult(item.student_id)}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
