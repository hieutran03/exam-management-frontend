import { useNavigate } from 'react-router-dom';

const ClassDashboard = () => {
  const classData = [
    {
      classCode: 'ABC123',
      subjectName: 'Mathematics',
      gradingTasks: 50,
      examTasks: 10,
      gradingRatio: '80%',
      examRatio: '20%',
      resultsCount: 200,
    },
    {
      classCode: 'DEF456',
      subjectName: 'Science',
      gradingTasks: 45,
      examTasks: 15,
      gradingRatio: '70%',
      examRatio: '30%',
      resultsCount: 180,
    },
    {
      classCode: 'GHI789',
      subjectName: 'History',
      gradingTasks: 40,
      examTasks: 20,
      gradingRatio: '75%',
      examRatio: '25%',
      resultsCount: 160,
    },
    {
      classCode: 'GHI789',
      subjectName: 'History',
      gradingTasks: 40,
      examTasks: 20,
      gradingRatio: '75%',
      examRatio: '25%',
      resultsCount: 160,
    },
  ];
  const navigate=useNavigate();

  const handleClassClick = (classCode:string) => {
    navigate(`/classes/${classCode}`);
  };

  return (
    <div
      style={{

        fontFamily: 'Arial, sans-serif',
        paddingTop: '64px', 
        padding: '20px',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {classData.map((data, index) => (
          <div
            key={index}
            onClick={() => handleClassClick(data.classCode)}
            style={{
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              <strong>Class:</strong> {data.classCode}
            </p>
            <p style={{ marginBottom: '5px', color: '#555' }}>
              <strong>Subject:</strong> {data.subjectName}
            </p>
            <p style={{ marginBottom: '5px', color: '#555' }}>
              <strong>Total Results:</strong> {data.resultsCount}
            </p>
            <p style={{ marginBottom: '5px', color: '#555' }}>
              <strong>Grading:</strong> {data.gradingTasks} ({data.gradingRatio})
            </p>
            <p style={{ color: '#555' }}>
              <strong>Exam:</strong> {data.examTasks} ({data.examRatio})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default ClassDashboard;
