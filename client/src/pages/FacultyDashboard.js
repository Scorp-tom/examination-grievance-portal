import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import FacultyGrievanceList from '../components/faculty/FacultyGrievanceList';
import { useAuth } from "../context/AuthContext";

export default function FacultyDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const { api } = useAuth(); // Use the authenticated api instance

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/faculty/grievances');
        setGrievances(res.data);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Error fetching grievances');
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const handleRespond = async (grievanceId, response) => {
    try {
      await api.put(`/api/faculty/grievances/${grievanceId}`, { response });
      const updatedGrievances = grievances.map(g => 
        g._id === grievanceId ? { ...g, response, status: 'resolved', resolvedAt: new Date() } : g
      );
      setGrievances(updatedGrievances);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error responding to grievance');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50">Assigned Grievances</h2>
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : grievances.length === 0 ? (
          <div className="p-4 text-gray-500">No grievances assigned to you.</div>
        ) : (
          <FacultyGrievanceList 
            grievances={grievances} 
            onRespond={handleRespond}
          />
        )}
      </div>
    </div>
  );
}