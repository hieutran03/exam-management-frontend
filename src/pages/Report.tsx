import { CustomModal } from "@/components/custom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import customAxios from "@/lib/customAxios";
import { Icons } from "@/lib/icon";
import { Check, ChevronsUpDown, ClipboardPlus, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Report = () => {
	const [semesters, setSemesters] = useState<
		{
			id: number;
			semester: number;
			first_year: string;
			second_year: string;
		}[]
	>([]);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [reports, setReports] = useState<
		{
			title: string;
			total_of_exam: number;
			total_of_exam_result: number;
			teacher_name: string;
			ssy_id: number;
		}[]
	>([]);

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

		const getReports = async () => {
			try {
				const response = await customAxios.get("/my-report");

				if (response.status === 200) {
					setReports(response.data);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		getSemester();
		getReports();
	}, []);
	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<div className="w-14 h-14 relative">
						<Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-xl">My Reports</p>
						<div className="flex items-center">
							<p className="text-sm text-muted-foreground font-medium italic">
								{reports.length} reports
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
						<ClipboardPlus className="w-5 h-5" />
					</Button>
					<Button variant="secondary" size={"icon"}>
						<Ellipsis className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="flex flex-wrap gap-4">
				{reports.map((report) => (
					<Link
						key={report.ssy_id}
						to={`/reports/${report.ssy_id}`}
						className="bg-white rounded-md shadow-sm border border-slate-200  flex flex-col justify-between gap-y-4 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out px-4 py-2.5 w-[400px]"
					>
						<div className="text-2xl font-bold tracking-tight text-center">
							{report.title}
						</div>
						<div className="space-y-2 px-10">
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Teacher Name</div>
								<div>{report.teacher_name}</div>
							</div>
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Total of Exam</div>
								<div>{report.total_of_exam}</div>
							</div>
							<div className="flex items-center font-medium  justify-between gap-x-2">
								<div className="text-lg italic">Total of Exam Result</div>
								<div>{report.total_of_exam_result}</div>
							</div>
						</div>
					</Link>
				))}
			</div>
			<ModalReport
				open={openModal}
				onClose={() => setOpenModal(false)}
				semesters={semesters}
			/>
		</div>
	);
};

export default Report;

const ModalReport = ({
	open,
	onClose,
	semesters,
}: {
	open: boolean;
	onClose: () => void;
	semesters: {
		id: number;
		semester: number;
		first_year: string;
		second_year: string;
	}[];
}) => {
	const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
	const [visibleSemesters, setVisibleSemesters] = useState<boolean>(false);

	const addReport = async () => {
		try {
			if (!selectedSemester) {
				toast.error("Please select a semester");
				return;
			}

			console.log(selectedSemester);

			const response = await customAxios.post("/my-report", {
				ssy_id: selectedSemester,
			});

			if (response.status === 201) {
				toast.success("Report added successfully");
				onClose();
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<CustomModal size="w-[300px]" open={open} onClose={onClose}>
			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl">Add new report</h2>
				<hr className="my-1" />
				<div className="space-y-2 w-full">
					<Label>Semesters</Label>
					<Popover open={visibleSemesters} onOpenChange={setVisibleSemesters}>
						<PopoverTrigger asChild>
							<Button variant="outline" className="flex justify-between w-full">
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
				<div className="w-full flex items-center justify-end">
					<Button onClick={addReport}>Add</Button>
				</div>
			</div>
		</CustomModal>
	);
};
