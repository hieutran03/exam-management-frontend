export interface Question {
	id: string;
	question: string;
	type: "Multiple" | "Essay";
	course: string;
	answers?: string[];
	level: "Easy" | "Medium" | "Hard";
	result?: string;
	createdAt: string;
	createdBy: User;
}

interface User {
	id: string;
	name: string;
	avatar: string;
}
