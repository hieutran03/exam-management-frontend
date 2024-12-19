export interface TeachersWithDetailsModelData {
    id?: number;
    name?: string;
    username?: string;
    password?: string;
    role_id?: number;
    created_at?: string;
    deleted?: boolean;
    role_name?: string; 
  }
  
  export class TeachersWithDetailsModel {
    id?: number;
    name?: string;
    username?: string;
    password?: string;
    role_id?: number;
    created_at?: string;
    deleted?: boolean;
    role_name?: string; 

  
    constructor(data: TeachersWithDetailsModelData) {
      this.id = data.id;
      this.name = data.name;
      this.username = data.username;
      this.password = data.password;
      this.role_id = data.role_id;
      this.created_at = data.created_at;
      this.deleted = data.deleted;
      this.role_name = data.role_name;
    }
  }


  export const mockTeachersDetails: TeachersWithDetailsModel[] = [
  {
    id: 123,
    name: 'John Doe',
    username: 'johndoe',
    created_at: new Date().toISOString(),
    role_id: 1,
    role_name: 'Admin',
    password: '123',
    deleted: false
  },
  {
    id: 456,
    name: 'Jane Smith',
    username: 'janesmith',
    created_at: new Date().toISOString(),
    role_id: 2,
    role_name: 'Teacher',
    password: '123',
    deleted: false
  },
  {
    id: 789,
    name: 'Alice Brown',
    username: 'alicebrown',
    created_at: new Date().toISOString(),
    role_id: 3,
    role_name: 'Student',
    password: '123',
    deleted: false
  },
  {
    id: 1112,
    name: 'Tuấn',
    username: 'tuána',
    created_at: new Date().toISOString(),
    role_id: 2,
    role_name: 'Teacher',
    password: '123',
    deleted: false
  },
];
  