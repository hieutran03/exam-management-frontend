import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockTeachersDetails,TeachersWithDetailsModel } from '@/models/teacher/teacherModelDetail';

const TeacherDetail = () => {
  const { id } = useParams(); 
  const [teacher, setTeacher] = useState<TeachersWithDetailsModel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<TeachersWithDetailsModel | null>(null);
//   const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTeacherDetail =  () => {
      try {
        var idNumber=Number.parseInt(id!)||"1";
        const data = mockTeachersDetails.find(e=>e.id==idNumber); 
        setEditForm(data!);
        setTeacher(data!);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };

    getTeacherDetail();
 }, [id]);

//   useEffect(() => {
//     const getTeacherDetail = async () => {
//       try {
//         const data = await fetchTeacherById(Number(id)); // Fetch data by ID
//         setTeacher(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching teacher details:', error);
//         setLoading(false);
//       }
//     };
//
//     getTeacherDetail();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;

//   if (!teacher) return <p>No teacher found!</p>;


const handleEdit = () => {
  setIsEditing(true);
};

const handleCancel = () => {
  setIsEditing(false);
  setEditForm(teacher); // Reset lại form về dữ liệu ban đầu
};

const handleSave = () => {

  console.log('Saving data:', editForm);
  setTeacher(editForm); // 
  setIsEditing(false);
};

const handleInputChange = (e:any) => {
  const { name, value } = e.target;
  setEditForm({ ...editForm, [name]: value });
};

const handleDelete = () => {
  if (window.confirm('Are you sure you want to delete this teacher?')) {
    alert(`Delete teacher ${teacher?.name}`);
  }
};

if (!teacher) return <p>No teacher found!</p>;

return (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center'}}>
    <div
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
      }}
    >
    

      {isEditing ? (
        <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong style={{ width: '100px' }}>Name:</strong>
          <input
            type="text"
            name="name"
            value={editForm?.name}
            onChange={handleInputChange}
            style={{
              padding: '5px',
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong style={{ width: '100px' }}>Role:</strong>
          <input
            type="text"
            name="role_name"
            value={editForm?.role_name}
            onChange={handleInputChange}
            style={{
              padding: '5px',
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong style={{ width: '100px' }}>Password:</strong>
          <input
            type="text"
            name="password"
            value={editForm?.password}
            onChange={handleInputChange}
            style={{
              padding: '5px',
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </label>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {teacher?.name || 'Not found'}
          </p>
          <p>
            <strong>Username:</strong> {teacher?.username || 'Not found'}
          </p>
          <p>
            <strong>Role:</strong> {teacher?.role_name || 'Not found'}
          </p>
          <p>
            <strong>Password:</strong> {teacher?.password || 'Not provided'}
          </p>
          <p>
            <strong>Created At:</strong> {teacher?.created_at|| 'Not provided'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={handleEdit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF4D4F',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
        </div>
      )}
    </div>
  </div>
);
};

export default TeacherDetail;
