import { TeacherModel } from '@/models/teacher/teacherModel';
import React, { useEffect, useState } from 'react';
import { fetchAllTeachers } from '@/service/TeacherService'
import { mockTeachers } from '@/models/teacher/teacherModel';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
  const [teachers, setTeachers] = useState<TeacherModel[]>(mockTeachers);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getTeachers = async () => {
  //     try {
  //       const data = await fetchAllTeachers(); 
  //       setTeachers(data); 
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching teachers:', error);
  //       setLoading(false);
  //     }
  //   };

  //   getTeachers();
  // }, []);

  // if (loading) return <p>Loading...</p>;

  const navigate=useNavigate();

  const handleTeacherClick = (classCode:number) => {
    navigate(`/teachers/${classCode}`);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        paddingTop: '64px', 
        backgroundColor: '#f4f6f9',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {teachers.map((teacher, index) => (
          <div
            onClick={() => handleTeacherClick(teacher.id)}
            key={index}
            style={{
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                {teacher.name}
              </div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '8px' }}>
                <strong>Username:</strong> {teacher.username}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>
                <strong>Joined:</strong> {new Date(teacher.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default TeacherList;
