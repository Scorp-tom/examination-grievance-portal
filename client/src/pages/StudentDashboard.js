import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GrievanceList from '../components/student/GrievanceList';
import GrievanceForm from '../components/student/GrievanceForm';

export default function StudentDashboard() {
  const { user, api } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/api/grievances/student');
        setGrievances(response.data);
      } catch (err) {
        console.error('Error fetching grievances:', err);
        setError(err.response?.data?.error || 'Failed to load grievances');
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [api]);

  const handleNewGrievance = (newGrievance) => {
    setGrievances([newGrievance, ...grievances]);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'New Grievance'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <GrievanceForm onSubmit={handleNewGrievance} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-4 bg-gray-50">Your Grievances</h2>
          {grievances.length === 0 ? (
            <div className="p-4 text-gray-500">No grievances submitted yet.</div>
          ) : (
            <GrievanceList grievances={grievances} />
          )}
        </div>
      )}
    </div>
  );
}


// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import { format } from 'date-fns';
// import GrievanceForm from '../components/student/GrievanceForm';
// import GrievanceList from '../components/student/GrievanceList';

// export default function StudentDashboard() {
//   const { user } = useAuth();
//   const [grievances, setGrievances] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     const fetchGrievances = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/grievances/student');
//         setGrievances(res.data);
//       } catch (err) {
//         console.error(err.response?.data?.msg || 'Error fetching grievances');
//       }
//     };

//     fetchGrievances();
//   }, []);

//   const handleNewGrievance = (newGrievance) => {
//     setGrievances([newGrievance, ...grievances]);
//     setShowForm(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Student Dashboard</h1>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//         >
//           {showForm ? 'Cancel' : 'New Grievance'}
//         </button>
//       </div>
      
//       {showForm && (
//         <div className="mb-8">
//           <GrievanceForm onSubmit={handleNewGrievance} />
//         </div>
//       )}
      
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <h2 className="text-xl font-semibold p-4 bg-gray-50">Your Grievances</h2>
//         {grievances.length === 0 ? (
//           <div className="p-4 text-gray-500">No grievances submitted yet.</div>
//         ) : (
//           <GrievanceList grievances={grievances} />
//         )}
//       </div>
//     </div>
//   );
// }