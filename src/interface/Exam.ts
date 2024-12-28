export interface Exam {
	id: number;
	examDate: string;
	time: number;
	totalScore: number;
	course: string;
	teacher: string;
	title?: string;
	questions?: { id: number; content: string }[];
	course_id?: number;
	semester_school_year_id?: number;
}
