import { toast } from "sonner";
import { ClassTable, CustomModal } from "@/components/custom";
import { Button } from "@/components/ui/button";
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
import { Permission, Teacher, User } from "@/interface";
import { Class } from "@/interface/Class";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { cn } from "@/lib/utils";
import {
	Check,
	ChevronsUpDown,
	Ellipsis,
	Plus,
	SquarePlus,
} from "lucide-react";
import { useEffect, useState } from "react";

const Classes = () => {
	const [classes, setClasses] = useState<Class[]>([]);
	const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);

	const [selectCourse, setSelectCourse] = useState<number>(1);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openModalClass, setOpenModalClass] = useState<boolean>(false);
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
		const getCourses = async () => {
			try {
				const response = await customAxios.get("/courses");

				if (response.status === 200) {
					setCourses(response.data);
				}
			} catch (error: any) {
				console.log(error);
			}
		};
		const getUser = async () => {
			try {
				const response = await customAxios.get("/auth/my-profile");

				if (response.status === 200) {
					setUser({
						id: response.data.id,
						name: response.data.name,
						username: response.data.username,
						role: {
							id: response.data.rolePermission.id,
							name: response.data.rolePermission.name,
							permissions: response.data.rolePermission.permissions,
						},
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getUser();

		getCourses();
	}, []);

	useEffect(() => {
		const getClasses = async () => {
			try {
				const response = await customAxios.get(
					`/courses/${selectCourse}/course-class`,
				);

				if (response.status === 200) {
					const formattedData: Class[] = response.data.map((item: any) => ({
						class_id: item.class_id,
						teacher: item.teacher_name,
						course_id: item.course_id,
						course_name: item.course_name,
					}));

					setClasses(formattedData);
				}
			} catch (error: any) {
				console.log(error);
			}
		};

		getClasses();
	}, [selectCourse]);

	const isTeacherModify: boolean = user.role.permissions.includes(
		Permission.TEACHER_MODIFY,
	);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">Classes</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{classes.length} questions
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					{isTeacherModify && (
						<Button
							onClick={() => setOpenModalClass(true)}
							variant="ghost"
							size={"icon"}
						>
							<SquarePlus className="w-5 h-5" />
						</Button>
					)}
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
				<div className="sm:col-span-1 space-y-1">
					<div className="flex items-center justify-between gap-x-2 mt-5">
						<p className="text-lg font-medium italic">Courses</p>
						{isTeacherModify && (
							<Button
								onClick={() => setOpenModal(true)}
								variant={"ghost"}
								size={"icon"}
							>
								<Plus className="w-5 h-5" />
							</Button>
						)}
					</div>
					<div className="max-h-[300px] w-full overflow-y-auto space-y-2 border px-3 py-1.5 rounded-md">
						{courses.map((course) => (
							<Button
								key={course.id}
								variant="ghost"
								size={"lg"}
								onClick={() => setSelectCourse(course.id)}
								className={`w-full ${
									selectCourse === course.id ? "bg-slate-200" : ""
								}`}
							>
								{course.name}
							</Button>
						))}
					</div>
				</div>
				<div className="sm:col-span-3">
					<ClassTable data={classes} />
				</div>
			</div>
			<ModalCourse open={openModal} onClose={() => setOpenModal(false)} />
			<ModalClass
				open={openModalClass}
				onClose={() => setOpenModalClass(false)}
				courseId={selectCourse}
			/>
		</div>
	);
};

export default Classes;

const ModalCourse = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const [courseName, setCourseName] = useState<string>("");
	const addCourse = async () => {
		try {
			const response = await customAxios.post("/courses", {
				name: courseName,
			});

			if (response.status === 201) {
				toast.success("Course added successfully");
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
			toast.error("Failed to add course");
		}
	};

	return (
		<CustomModal size="w-[450px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Course</h2>
				<hr className="my-1" />
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">Course Name</Label>
						<Input
							defaultValue={courseName}
							onChange={(e) => setCourseName(e.target.value)}
							type="text"
							id="firstName"
							placeholder="Enter course name"
						/>
					</div>
					<div className="w-full flex items-center justify-end">
						<Button onClick={addCourse}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};

const ModalClass = ({
	open,
	onClose,
	courseId,
}: {
	open: boolean;
	onClose: () => void;
	courseId: number;
}) => {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [semesters, setSemesters] = useState<
		{
			id: number;
			semester: number;
			first_year: string;
			second_year: string;
		}[]
	>([]);

	const [className, setClassName] = useState<string>("");
	const [visibleSemesters, setVisibleSemesters] = useState<boolean>(false);
	const [visibleTeachers, setVisibleTeachers] = useState<boolean>(false);

	const [selectedSemester, setSelectedSemester] = useState<number>(0);
	const [selectedTeacher, setSelectedTeacher] = useState<number>(0);

	useEffect(() => {
		const getTeachers = async () => {
			try {
				const response = await customAxios.get("/teachers");

				if (response.status === 200) {
					setTeachers(response.data);
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

		getTeachers();
		getSemester();
	}, []);

	const addClass = async () => {
		try {
			if (!className || !selectedTeacher || !selectedSemester) {
				toast.error("Please fill all fields");
				return;
			}

			const response = await customAxios.post(
				`courses/${courseId}/course-class`,
				{
					class_id: className,
					teacher_id: selectedTeacher,
					semester_school_year_id: selectedSemester,
				},
			);

			if (response.status === 201) {
				toast.success("Class added successfully");
				onClose();
			}
		} catch (error: any) {
			if (error.response.status === 400) {
				toast.error("Class already exists");
			}
		}
	};

	return (
		<CustomModal size="w-[500px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add New Class</h2>
				<hr className="my-1" />
				<div className="space-y-2">
					<div className="space-y-2 w-full">
						<Label htmlFor="name">Class Id</Label>
						<Input
							defaultValue={className}
							onChange={(e) => setClassName(e.target.value)}
							type="text"
							id="name"
							placeholder="Enter class name"
						/>
					</div>
					<div className="flex items-center gap-x-4">
						<div className="space-y-2 w-full">
							<Label>Teachers</Label>
							<Popover open={visibleTeachers} onOpenChange={setVisibleTeachers}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="flex justify-between w-full"
									>
										{selectedTeacher
											? teachers.find(
													(teacher) => teacher.id === selectedTeacher,
											  )?.name
											: "Select teacher"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0 z-999">
									<Command>
										<CommandInput placeholder="Search teachers..." />
										<CommandList>
											<CommandEmpty>No teachers found.</CommandEmpty>
											<CommandGroup heading="Courses">
												{teachers.map((teacher) => (
													<CommandItem
														key={teacher.id}
														onSelect={() => {
															setSelectedTeacher(teacher.id);
															setVisibleTeachers(false);
														}}
													>
														{teacher.name}
														<Check
															className={cn(
																"ml-auto",
																selectedTeacher === teacher.id
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

					<div className="w-full flex items-center justify-end">
						<Button onClick={addClass}>Add</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
