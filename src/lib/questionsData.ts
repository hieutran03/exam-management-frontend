import { Question } from "@/interface";

export const questionsData: Question[] = [
	{
		id: "1",
		question: "What is the capital of France?",
		type: "Multiple",
		answers: ["Paris", "Lyon", "Marseille", "Toulouse"],
		result: "Paris",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "1",
			name: "John Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/58efab3fcd310ee26c62f8df400b0048881bba3b-1083x1083.png",
		},
		course: "NT201",
		level: "Easy",
	},
	{
		id: "2",
		question: "What is the capital of Spain?",
		type: "Multiple",
		answers: ["Madrid", "Barcelona", "Valencia", "Seville"],
		result: "Madrid",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "2",
			name: "Jane Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/db39b602de6ade3cbe6e5dd962f9544f07b28edd-1083x1083.png",
		},
		course: "NT201",
		level: "Easy",
	},
	{
		id: "3",
		question: "What is the capital of Italy?",
		type: "Multiple",
		answers: ["Rome", "Milan", "Naples", "Turin"],
		result: "Rome",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "3",
			name: "Alice Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/9962f6fb7ba946ce4e10ddc971bbbf038f852004-1083x1083.png",
		},
		course: "NT201",
		level: "Easy",
	},
	{
		id: "4",
		question: "What is the capital of Germany?",
		type: "Multiple",
		answers: ["Berlin", "Hamburg", "Munich", "Cologne"],
		result: "Berlin",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "3",
			name: "Alice Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/9962f6fb7ba946ce4e10ddc971bbbf038f852004-1083x1083.png",
		},
		course: "NT201",
		level: "Hard",
	},
	{
		id: "5",
		question: "What is the capital of the United Kingdom?",
		type: "Multiple",
		answers: ["London", "Manchester", "Birmingham", "Glasgow"],
		result: "London",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "4",
			name: "David Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/a1f233e88cb8e64e4778dac82b067e81cd55e04d-1083x1083.png",
		},
		course: "NT201",
		level: "Easy",
	},
	{
		id: "6",
		question: "What is the capital of the United States?",
		type: "Multiple",
		answers: ["Washington, D.C.", "New York City", "Los Angeles", "Chicago"],
		result: "Washington, D.C.",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "4",
			name: "David Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/a1f233e88cb8e64e4778dac82b067e81cd55e04d-1083x1083.png",
		},
		course: "NT201",
		level: "Medium",
	},
	{
		id: "7",
		question: "What is the capital of Canada?",
		type: "Multiple",
		answers: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
		result: "Ottawa",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "2",
			name: "Jane Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/db39b602de6ade3cbe6e5dd962f9544f07b28edd-1083x1083.png",
		},
		course: "NT201",
		level: "Easy",
	},
	{
		id: "8",
		question: "What is the capital of Australia?",
		type: "Multiple",
		answers: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
		result: "Canberra",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "1",
			name: "John Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/58efab3fcd310ee26c62f8df400b0048881bba3b-1083x1083.png",
		},
		course: "NT201",
		level: "Medium",
	},
	{
		id: "9",
		question: "What is the capital of Australia?",
		type: "Essay",
		createdAt: "2021-08-02T10:00:00Z",
		createdBy: {
			id: "1",
			name: "John Doe",
			avatar:
				"https://cdn.sanity.io/images/e3a07iip/production/58efab3fcd310ee26c62f8df400b0048881bba3b-1083x1083.png",
		},
		course: "NT201",
		level: "Hard",
	},
];
