export interface Role {
	id: number;
	name: string;
}

export interface RolePermission {
	id: number;
	name: string;
	permissions: Permission[];
}

export enum Permission {
	TEACHER_MODIFY = "TEACHER_MODIFY",
	TEACHER_READ = "TEACHER_READ",
	QUESTION_MODIFY = "QUESTION_MODIFY",
	QUESTION_READ = "QUESTION_READ",
	EXAM_MODIFY = "EXAM_MODIFY",
	EXAM_READ = "EXAM_READ",
	GRADE_MODIFY = "GRADE_MODIFY",
	GRADE_READ = "GRADE_READ",
	REPORT_READ = "REPORT_READ",
}

export const getAllPermissions = (): Permission[] => {
	return Object.values(Permission);
};
