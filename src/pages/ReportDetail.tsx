import { Separator } from "@/components/ui/separator";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReportDetail = () => {
	const [semesters, setSemesters] = useState<
		{
			id: number;
			semester: number;
			first_year: string;
			second_year: string;
		}[]
	>([]);
	const { reportId } = useParams<{ reportId: string }>();
	interface Report {
		details: {
			course_id: number;
			title: string;
			number_of_exam: number;
			number_of_exam_result: number;
			percentage_of_exam: number;
			percentage_of_exam_result: number;
		}[];
	}

	const [report, setReport] = useState<Report>({ details: [] });

	useEffect(() => {
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

		getSemester();
	}, []);

	useEffect(() => {
		const getReport = async () => {
			try {
				const response = await customAxios.get(`/my-report/${reportId}`);

				if (response.status === 200) {
					setReport(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getReport();
	}, [reportId]);

	return (
		<div className="w-full">
			<div className="flex items-center justify-start">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">
							Semester{" "}
							{
								semesters.find((semester) => semester.id === Number(reportId))
									?.semester
							}
						</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{
									semesters.find((semester) => semester.id === Number(reportId))
										?.first_year
								}{" "}
								-{" "}
								{
									semesters.find((semester) => semester.id === Number(reportId))
										?.second_year
								}
							</p>
						</div>
					</div>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="flex flex-wrap gap-4">
				{report.details?.map((item: any) => (
					<div
						key={item.course_id}
						className="bg-white rounded-md shadow-sm border border-slate-200  flex flex-col justify-between gap-y-4 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out px-4 py-2.5 w-[500px]"
					>
						<div className="text-2xl font-bold tracking-tight text-center">
							{item.title}
						</div>
						<div className="space-y-2 px-10">
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Number of Exam</div>
								<div>{item.number_of_exam}</div>
							</div>
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Number of Exam Result</div>
								<div>{item.number_of_exam_result}</div>
							</div>
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Percentage of Exam</div>
								<div>{item.percentage_of_exam}</div>
							</div>
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Percentage of Exam Result</div>
								<div>{item.percentage_of_exam_result}</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReportDetail;
