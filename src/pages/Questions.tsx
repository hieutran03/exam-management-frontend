import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/lib/icon";
import { Download, Ellipsis, Plus } from "lucide-react";
import { CustomModal, QuestionTable } from "@/components/custom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questionsData } from "@/lib/questionsData";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Questions = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [questionType, setQuestionType] = useState<string>("Multiple");
	const [questionLevel, setQuestionLevel] = useState<string>("Easy");

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
								10 questions
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Button onClick={() => setOpen(true)} variant="ghost" size={"icon"}>
						<Plus className="w-5 h-5" />
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
			<QuestionTable data={questionsData} />
			<CustomModal size="w-[450px]" open={open} onClose={() => setOpen(false)}>
				<div className="flex flex-col gap-4 w-full">
					<h2 className="text-2xl">Add New Question</h2>
					<hr className="my-1" />
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">Question Title</Label>
							<Input
								type="text"
								id="firstName"
								placeholder="Enter question title"
							/>
						</div>
						<RadioGroup
							defaultValue={questionLevel}
							onValueChange={(e: string) => setQuestionLevel(e)}
							className="flex items-center gap-x-2"
						>
							{["Easy", "Medium", "Hard"].map((type) => (
								<div key={type}>
									<RadioGroupItem
										value={type}
										id={type}
										className="peer sr-only "
									/>
									<Label
										htmlFor={type}
										className="flex h-9 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-400 [&:has([data-state=checked])]:border-teal-400 cursor-pointer"
									>
										{type}
									</Label>
								</div>
							))}
						</RadioGroup>
						<RadioGroup
							defaultValue={questionType}
							onValueChange={(e: string) => setQuestionType(e)}
							className="flex items-center gap-x-2"
						>
							{["Multiple", "Essay"].map((type) => (
								<div key={type}>
									<RadioGroupItem
										value={type}
										id={type}
										className="peer sr-only "
									/>
									<Label
										htmlFor={type}
										className="flex h-9 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-400 [&:has([data-state=checked])]:border-teal-400 cursor-pointer"
									>
										{type}
									</Label>
								</div>
							))}
						</RadioGroup>
						{questionType === "Multiple" && (
							<>
								<div className="grid w-full gap-1.5">
									<Label htmlFor="answer">Answer</Label>
									<Input type="text" name="A" placeholder="Enter answer" />
									<Input type="text" name="B" placeholder="Enter answer" />
									<Input type="text" name="C" placeholder="Enter answer" />
									<Input type="text" name="D" placeholder="Enter answer" />
								</div>
							</>
						)}
						<div className="space-y-2">
							<Label htmlFor="result">Result</Label>
							{questionType === "Multiple" ? (
								<Input type="text" id="result" placeholder="Enter result" />
							) : (
								<Textarea
									id="result"
									placeholder="Enter result"
									className="focus-visible:ring-1 focus-visible:ring-offset-1"
								/>
							)}
						</div>
						<div className="w-full flex items-center justify-end">
							<Button>Add</Button>
						</div>
					</form>
				</div>
			</CustomModal>
		</div>
	);
};

export default Questions;
