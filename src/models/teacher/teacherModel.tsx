export interface TeacherModel {
    id: number;
    name: string;
    username: string;
    createdAt: string;
  }


  export const mockTeachers: TeacherModel[] = [
    {
      id:123,
      name: 'John Doe',
      username: 'johndoe',
      createdAt: new Date().toISOString(),
    },
    {
      id:456,
      name: 'Jane Smith',
      username: 'janesmith',
      createdAt: new Date().toISOString(),
    },
    {
      id:789,
      name: 'Alice Brown',
      username: 'alicebrown',
      createdAt: new Date().toISOString(),
    },
    {
      id:1112,
      name: 'Tuấn',
      username: 'tuána',
      createdAt: new Date().toISOString(),
    },
  ];

  export * from './teacherModel';