export interface User {
	id: number;
	name: string;
	username: string;
	role: Role;
}

interface Role {
	name: string;
	permissions: string[];
}

export interface Teacher {
	id: number;
	name: string;
	username: string;
	role_id: number;
	role_name: string;
}
