import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/lib/icon";
import { Check, Edit, Ellipsis, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Class, Teacher } from "@/interface";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import customAxios from "@/lib/customAxios";

const ClassDetail = () => {
	const { classId, courseId } = useParams<{
		classId: string;
		courseId: string;
	}>();

	const navigate: NavigateFunction = useNavigate();

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [semesters, setSemesters] = useState<
		{
			id: number;
			semester: number;
			first_year: string;
			second_year: string;
		}[]
	>([]);
	const [classDetail, setClassDetail] = useState<Class>({
		class_id: "",
		course_id: 0,
		course_name: "",
		teacher: "",
		semester_school_year: "",
	});
	const [teachers, setTeachers] = useState<Teacher[]>([]);

	const [selectedSemester, setSelectedSemester] = useState<number>(0);
	const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
	const [className, setClassName] = useState<string>("");

	const [visibleSemesters, setVisibleSemesters] = useState<boolean>(false);
	const [visibleTeachers, setVisibleTeachers] = useState<boolean>(false);

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

		const getClassDetail = async () => {
			try {
				const response = await customAxios.get(
					`/courses/${courseId}/course-class/${classId}`,
				);

				if (response.data) {
					setClassDetail({
						class_id: response.data.class_id,
						course_id: response.data.course_id,
						course_name: response.data.course_name,
						teacher: response.data.teacher_name,
						semester_school_year: response.data.semester_school_year,
					});
				}
			} catch (error: any) {
				console.error(error.message);
			}
		};

		getClassDetail();
		getTeachers();
	}, [classId, courseId]);

	useEffect(() => {
		const getSemesters = async () => {
			try {
				const response = await customAxios.get("/semesters");

				if (response.data) {
					setSemesters(response.data);
				}
			} catch (error: any) {
				console.error(error.message);
			}
		};

		getSemesters();
	}, []);

	const handleSave = async () => {
		try {
			if (!classDetail.class_id) {
				toast.error("Please enter a class ID.");
				return;
			}

			if (selectedSemester === 0) {
				toast.error("Please select a semester.");
				return;
			}

			if (selectedTeacher === 0) {
				toast.error("Please select a teacher.");
				return;
			}

			const response = await customAxios.put(
				`/courses/${courseId}/course-class/${classId}`,
				{
					class_id: className,
					semester_school_year_id: selectedSemester,
					teacher_id: selectedTeacher,
				},
			);

			if (response.status === 200) {
				toast.success("Class updated successfully.");
				setIsEditing(false);
				navigate(`/classes/${className}/${courseId}`);
			}
		} catch (error: any) {
			if (error.response.status === 400) {
				toast.error(
					"Class ID already exists. Please enter a different class ID.",
				);
			}
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
						<p className="font-medium text-xl">Class Detail</p>
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
				<Card className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-4 ">
					<CardHeader className="space-y-1 relative flex justify-center items-center">
						<CardTitle className="text-2xl font-bold tracking-tight text-center">
							Edit Class
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 py-2">
						<div className="flex flex-col gap-y-2 w-full relative">
							<Label>Class ID</Label>
							<Input
								defaultValue={classDetail.class_id}
								onChange={(e) => setClassName(e.target.value)}
								type="text"
								name="inputValue"
								className="p-[11px] rounded-md border border-gray-300 focus-visible:outline-none"
							/>
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
						<div className="flex flex-col gap-y-2 w-full relative">
							<Label>Teacher</Label>
							<Button
								onClick={() => {
									setVisibleTeachers(!visibleTeachers);
								}}
								variant={"ghost"}
								className="justify-start"
							>
								{selectedTeacher
									? teachers.find((teacher) => teacher.id === selectedTeacher)
											?.name
									: "Select teacher"}
							</Button>
							{visibleTeachers && (
								<div className="absolute top-[65px] max-h-[96px] overflow-y-auto z-10 w-full bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
									{teachers.map((teacher) => (
										<div
											onClick={() => {
												setSelectedTeacher(teacher.id);
												setVisibleTeachers(false);
											}}
											className="font-medium flex items-center gap-x-2 italic px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-md"
											key={teacher.id}
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
										</div>
									))}

									{teachers.length === 0 && (
										<div className="text-center italic font-medium text-gray-500">
											No semesters found.
										</div>
									)}
								</div>
							)}
						</div>
						<div className="w-full flex items-center justify-end">
							<Button onClick={handleSave}>Save</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card className="sm:mx-auto sm:w-full sm:max-w-2xl flex flex-col">
					<CardHeader className="space-y-1 relative flex justify-center items-center">
						<CardTitle className="text-2xl font-bold first-letter:uppercase tracking-tight text-center">
							{classDetail.course_name}
						</CardTitle>
						<CardDescription className="text-center text-xl font-semibold text-gray-700">
							{classDetail.class_id} - {classDetail.teacher}
						</CardDescription>
						<CardDescription className="text-center text-sm italic font-semibold text-gray-700">
							{classDetail.semester_school_year}
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</div>
	);
};

export default ClassDetail;
