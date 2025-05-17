import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import AdminGrievanceList from '../components/admin/AdminGrievanceList';
import Filters from '../components/admin/Filters';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [faculties, setFaculties] = useState([]); // New state for faculties
  const { user, api } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(true); // Separate loading for faculties
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    month: '',
    year: ''
  });

  // Fetch grievances and faculties on component mount and filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch grievances
        const params = new URLSearchParams();
        if (filters.department) params.append('department', filters.department);
        if (filters.status) params.append('status', filters.status);
        if (filters.month) params.append('month', filters.month);
        if (filters.year) params.append('year', filters.year);
        
        const [grievancesRes, facultiesRes] = await Promise.all([
          api.get(`/api/admin/grievances?${params.toString()}`),
          api.get('/api/admin/faculty') // Fetch all faculty members
        ]);
        
        setGrievances(grievancesRes.data);
        setFaculties(facultiesRes.data);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Error fetching data');
      } finally {
        setLoading(false);
        setFacultyLoading(false);
      }
    };

    fetchData();
  }, [filters, api]);

  const handleAssignFaculty = async (grievanceId, facultyId) => {
    try {
      await api.put(`/api/admin/grievances/${grievanceId}/assign`, { facultyId });
      
      // Update local state
      const updatedGrievances = grievances.map(g => 
        g._id === grievanceId ? { 
          ...g, 
          assignedTo: faculties.find(f => f._id === facultyId),
          status: 'assigned' 
        } : g
      );
      
      setGrievances(updatedGrievances);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error assigning faculty');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Filters filters={filters} setFilters={setFilters} />
      
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <h2 className="text-xl font-semibold p-4 bg-gray-50">Grievances</h2>
        
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading grievances...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="p-4 text-gray-500">No grievances found.</div>
        ) : (
          <AdminGrievanceList 
            grievances={grievances} 
            faculties={faculties}
            facultyLoading={facultyLoading}
            onAssignFaculty={handleAssignFaculty}
          />
        )}
      </div>
    </div>
  );
}
