import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Exam } from "@/interface";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { formatDate } from "date-fns";
import { Calendar, Clock, Ellipsis, File, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
	const [exams, setExams] = useState<Exam[]>([]);

	useEffect(() => {
		const getMyExams = async () => {
			try {
				const response = await customAxios.get("/my-exams");

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
				console.log(error.message);
			}
		};

		getMyExams();
	}, []);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">My Exams</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{exams.length} exams
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="flex flex-wrap gap-4">
				{exams.map((exam) => (
					<Link
						key={exam.id}
						to={`/${exam.id}`}
						className="bg-white rounded-md shadow-sm border border-slate-200  flex flex-col justify-between gap-y-4 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out px-4 py-2.5 w-[300px]"
					>
						<div className="flex items-center gap-x-2">
							<File className="w-5 h-5 text-slate-700 dark:text-slate-400" />
							<p className="text-base font-semibold">{exam.course}</p>
						</div>

						<div className="flex items-center gap-x-1">
							<User className="w-5 h-5 text-slate-700 dark:text-slate-400" />
							<p className="text-sm font-medium">{exam.teacher}</p>
						</div>
						<div className="flex items-center justify-between gap-x-2">
							<div className="flex items-center gap-x-1">
								<Clock className="w-5 h-5" />
								<p className="text-sm font-medium text-muted-foreground">
									{exam.time} min
								</p>
							</div>

							<div className="flex items-center gap-x-1">
								<Calendar className="w-5 h-5" />
								<p className="text-sm font-semibold">
									{formatDate(new Date(exam.examDate), "dd/MM/yyyy")}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Home;
