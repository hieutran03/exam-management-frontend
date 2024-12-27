export interface Exam {
	id: string;
	examDate: string;
	time: number;
	totalScore: number;
	course: string;
	teacher: string;
	title?: string;
	questions?: { id: number; content: string }[];
}
