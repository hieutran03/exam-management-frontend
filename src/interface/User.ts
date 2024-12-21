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
