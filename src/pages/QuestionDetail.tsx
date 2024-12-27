import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Permission, Question } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { Edit, Ellipsis, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuestionDetail = () => {
	const { questionId } = useParams<{ questionId: string }>();
	const [question, setQuestion] = useState<Question>({
		id: 0,
		content: "",
		course: "",
		level: "",
		teacher: "",
	});
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [levelId, setLevelId] = useState<number>(0);
	const [courseId, setCourseId] = useState<number>(0);
	const [levels, setLevels] = useState<{ id: number; name: string }[]>([]);
	const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
	const [visibleLevel, setVisibleLevel] = useState<boolean>(false);
	const [visibleCourse, setVisibleCourse] = useState<boolean>(false);

	useEffect(() => {
		const getLevels = async () => {
			try {
				const response = await customAxios.get("/question-levels");

				if (response.status === 200) {
					setLevels(response.data);
					setLevelId(
						response.data.find(
							(l: { id: number; name: string }) => l.name === question.level,
						)?.id,
					);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		const getCourses = async () => {
			try {
				const response = await customAxios.get("/courses");

				if (response.status === 200) {
					setCourses(response.data);
					setCourseId(
						response.data.find(
							(l: { id: number; name: string }) => l.name === question.course,
						)?.id,
					);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getLevels();
		getCourses();
	}, [question.level, question.course, isEditing]);

	useEffect(() => {
		const getQuestionDetail = async () => {
			try {
				const s = await customAxios.get("/auth/my-profile");

				const url = s.data.rolePermission.permissions.includes(
					Permission.QUESTION_MODIFY,
				)
					? "/questions"
					: "/my-questions";

				const response = await customAxios.get(`${url}/${questionId}`);

				if (response.status === 200) {
					setQuestion({
						id: response.data.id,
						content: response.data.content,
						course: response.data.course_name,
						level: response.data.question_level_name,
						teacher: response.data.teacher_name,
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getQuestionDetail();
	}, [questionId]);

	const handleSave = async () => {
		try {
			const s = await customAxios.get("/auth/my-profile");

			const url = s.data.rolePermission.permissions.includes(
				Permission.QUESTION_MODIFY,
			)
				? "/questions"
				: "/my-questions";

			console.log({
				content: question.content,
				course_id: courseId,
				question_level_id: levelId,
			});
			const response = await customAxios.put(`${url}/${questionId}`, {
				content: question.content,
				course_id: courseId,
				question_level_id: levelId,
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
						<p className="font-medium text-xl">Questions</p>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="flex flex-col gap-y-4">
				<Card className="sm:mx-auto sm:w-full sm:max-w-md">
					<CardHeader className="space-y-1 relative">
						<CardDescription className="text-center text-xl font-bold tracking-tight text-gray-700 ">
							Question Details
						</CardDescription>
						<div className="absolute right-1 top-0">
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
						</div>
					</CardHeader>
					<CardContent className="grid gap-4 py-2">
						<div className="flex flex-col gap-y-2">
							<Label>Question</Label>
							{isEditing ? (
								<Input
									defaultValue={question.content}
									onChange={(e) =>
										setQuestion({ ...question, content: e.target.value })
									}
									type="text"
									name="inputValue"
									className="p-[11px] rounded-md border border-gray-300 focus-visible:outline-none"
								/>
							) : (
								<Button variant={"ghost"} className="justify-start">
									{question.content}
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-y-2">
							<Label>Teacher</Label>
							<div className="font-medium">{question.teacher}</div>
						</div>
						<div className="flex flex-col gap-y-2 relative">
							<Label>Course</Label>
							{isEditing ? (
								<>
									<Button
										onClick={() => {
											setVisibleCourse(!visibleCourse);
										}}
										variant={"ghost"}
										className="justify-start"
									>
										{question.course}
									</Button>

									{visibleCourse && (
										<div className="absolute top-[68px] z-10 w-full h-[96px] overflow-y-auto flex-col flex bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
											{courses
												.filter((l) => l.name !== question.level)
												.map((l) => (
													<Button
														key={l.id}
														onClick={() => {
															setQuestion({ ...question, course: l.name });
															setCourseId(l.id);
															setVisibleCourse(false);
														}}
														variant={"ghost"}
														className="justify-start"
													>
														{l.name}
													</Button>
												))}
										</div>
									)}
								</>
							) : (
								<Button variant={"ghost"} className="justify-start">
									{question.course}
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-y-2 relative">
							<Label>Level</Label>
							{isEditing ? (
								<>
									<Button
										onClick={() => {
											setVisibleLevel(!visibleLevel);
										}}
										variant={"ghost"}
										className="justify-start"
									>
										{question.level}
									</Button>

									{visibleLevel && (
										<div className="absolute top-[68px] z-10 w-full h-[96px] overflow-y-auto flex-col flex bg-white rounded-md shadow-md p-2 space-y-1 border role-dropdown">
											{levels
												.filter((l) => l.name !== question.level)
												.map((l) => (
													<Button
														key={l.id}
														onClick={() => {
															setQuestion({ ...question, level: l.name });
															setLevelId(l.id);
															setVisibleLevel(false);
														}}
														variant={"ghost"}
														className="justify-start"
													>
														{l.name}
													</Button>
												))}
										</div>
									)}
								</>
							) : (
								<Button variant={"ghost"} className="justify-start">
									{question.level}
								</Button>
							)}
						</div>
					</CardContent>
					{isEditing && (
						<CardFooter className="flex justify-end">
							<Button onClick={handleSave}>Save</Button>
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	);
};

export default QuestionDetail;
