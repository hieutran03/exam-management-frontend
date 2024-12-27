import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/lib/icon";
import {
	Check,
	ChevronsUpDown,
	DiamondPlus,
	Download,
	Ellipsis,
	MessageSquarePlus,
} from "lucide-react";
import { CustomModal, QuestionTable } from "@/components/custom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { Permission, Question, User } from "@/interface";
import customAxios from "@/lib/customAxios";
import { cn } from "@/lib/utils";

const Questions = () => {
	const [levels, setLevels] = useState<{ id: number; name: string }[]>([]);
	const [openModalLevel, setOpenModalLevel] = useState<boolean>(false);
	const [openModalQuestion, setOpenModalQuestion] = useState<boolean>(false);
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

	const [questions, setQuestions] = useState<Question[]>([]);

	useEffect(() => {
		const getLevels = async () => {
			try {
				const response = await customAxios.get("/question-levels");

				if (response.status === 200) {
					setLevels(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getLevels();
	}, []);

	useEffect(() => {
		const getQuestions = async () => {
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
					Permission.QUESTION_READ,
				)
					? "/questions"
					: "/my-questions";

				const response = await customAxios.get(url);

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
				console.log(error.message);
			}
		};

		getQuestions();
	}, []);

	const isLevelModify = user.role.permissions.includes(
		Permission.QUESTION_MODIFY,
	);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Questions</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{questions.length} questions
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					{isLevelModify && (
						<Button onClick={() => setOpenModalLevel(true)} variant="ghost">
							<DiamondPlus className="w-5 h-5" />
							Level
						</Button>
					)}
					<Button onClick={() => setOpenModalQuestion(true)} variant="ghost">
						<MessageSquarePlus className="w-5 h-5" />
						Question
					</Button>
					<Button variant="ghost" size={"icon"}>
						<Download className="w-5 h-5" />
					</Button>

					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<QuestionTable data={questions} />

			<ModalLevel
				open={openModalLevel}
				onClose={() => setOpenModalLevel(false)}
			/>

			<ModalQuestion
				open={openModalQuestion}
				onClose={() => setOpenModalQuestion(false)}
				levels={levels}
			/>
		</div>
	);
};

export default Questions;

const ModalQuestion = ({
	open,
	onClose,
	levels,
}: {
	open: boolean;
	onClose: () => void;
	levels: { id: number; name: string }[];
}) => {
	const [questionLevel, setQuestionLevel] = useState<string>("easy");
	const [visible, setVisible] = useState<boolean>(false);
	const [questionTitle, setQuestionTitle] = useState<string>("");
	const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<number>(0);

	const user = useSelector((state: RootState) => state.auth.user);

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

		getCourses();
	}, []);

	const addQuestion = async () => {
		try {
			const response = await customAxios.post("/questions", {
				content: questionTitle,
				question_level_id: levels.find((level) => level.name === questionLevel)
					?.id,
				course_id: selectedCourse,
				teacher_id: user.id,
			});

			if (response.status === 201) {
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<CustomModal size="w-[540px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Question</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="flex items-center gap-x-4">
						<div className="space-y-2 w-full">
							<Label htmlFor="firstName">Question Title</Label>
							<Input
								type="text"
								id="firstName"
								value={questionTitle}
								onChange={(e) => setQuestionTitle(e.target.value)}
								placeholder="Enter question title"
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label>Course</Label>
							<Popover open={visible} onOpenChange={setVisible}>
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
															setVisible(false);
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
					</div>
					<RadioGroup
						defaultValue={questionLevel}
						onValueChange={(e: string) => setQuestionLevel(e)}
						className="flex items-center gap-x-2"
					>
						{levels.map((level) => (
							<div key={level.name}>
								<RadioGroupItem
									value={level.name}
									id={level.name}
									className="peer sr-only "
								/>
								<Label
									htmlFor={level.name}
									className="flex h-9 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-400 [&:has([data-state=checked])]:border-teal-400 cursor-pointer"
								>
									{level.name}
								</Label>
							</div>
						))}
					</RadioGroup>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addQuestion}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};

const ModalLevel = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const [levelName, setLevelName] = useState<string>("");

	const addLevel = async () => {
		try {
			const response = await customAxios.post("/question-levels", {
				name: levelName,
			});

			if (response.status === 201) {
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<CustomModal size="w-[450px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Level</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">Level Name</Label>
						<Input
							defaultValue={levelName}
							onChange={(e) => setLevelName(e.target.value)}
							type="text"
							id="firstName"
							placeholder="Enter role name"
						/>
					</div>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addLevel}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
