import { useParams } from 'react-router-dom';


const ClassDetail = () => {
  const { classCode } = useParams();

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
  ];

  const classDetail = classData.find(function(e){return e.classCode==classCode});

  if (!classDetail) {
    return <p>Class not found</p>;
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#333',
          }}
        >
          Class Detail: {classDetail.subjectName}
        </h2>
        <p style={{ fontSize: '1rem', color: '#555', marginBottom: '8px' }}>
          <strong>Class Code:</strong> {classCode}
        </p>
        <p style={{ fontSize: '1rem', color: '#555', marginBottom: '8px' }}>
          <strong>Grading:</strong> {classDetail.gradingTasks} ({classDetail.gradingRatio})
        </p>
        <p style={{ fontSize: '1rem', color: '#555', marginBottom: '8px' }}>
          <strong>Exam:</strong> {classDetail.examTasks} ({classDetail.examRatio})
        </p>
        <p style={{ fontSize: '1rem', color: '#555' }}>
          <strong>Total Results:</strong> {classDetail.resultsCount}
        </p>
      </div>
    </div>
  );
};

export default ClassDetail;
