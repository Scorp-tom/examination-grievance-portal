// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { format, parseISO } from 'date-fns';
// import AdminGrievanceList from '../components/admin/AdminGrievanceList';
// import Filters from '../components/admin/Filters';
// import { useAuth } from '../context/AuthContext';

// export default function AdminDashboard() {
//   const [grievances, setGrievances] = useState([]);
//   const [faculties, setFaculties] = useState([]); // New state for faculties
//   const { user, api } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [facultyLoading, setFacultyLoading] = useState(true); // Separate loading for faculties
//   const [filters, setFilters] = useState({
//     department: '',
//     status: '',
//     month: '',
//     year: ''
//   });

//   // Fetch grievances and faculties on component mount and filter changes
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch grievances
//         const params = new URLSearchParams();
//         if (filters.department) params.append('department', filters.department);
//         if (filters.status) params.append('status', filters.status);
//         if (filters.month) params.append('month', filters.month);
//         if (filters.year) params.append('year', filters.year);

//         const [grievancesRes, facultiesRes] = await Promise.all([
//           api.get(`/api/admin/grievances?${params.toString()}`),
//           api.get('/api/admin/faculty') // Fetch all faculty members
//         ]);

//         setGrievances(grievancesRes.data);
//         setFaculties(facultiesRes.data);
//       } catch (err) {
//         console.error(err.response?.data?.msg || 'Error fetching data');
//       } finally {
//         setLoading(false);
//         setFacultyLoading(false);
//       }
//     };

//     fetchData();
//   }, [filters, api]);

//   const handleAssignFaculty = async (grievanceId, facultyId) => {
//     try {
//       await api.put(`/api/admin/grievances/${grievanceId}/assign`, { facultyId });

//       // Update local state
//       const updatedGrievances = grievances.map(g =>
//         g._id === grievanceId ? {
//           ...g,
//           assignedTo: faculties.find(f => f._id === facultyId),
//           status: 'assigned'
//         } : g
//       );

//       setGrievances(updatedGrievances);
//     } catch (err) {
//       console.error(err.response?.data?.msg || 'Error assigning faculty');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

//       <Filters filters={filters} setFilters={setFilters} />

//       <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
//         <h2 className="text-xl font-semibold p-4 bg-gray-50">Grievances</h2>

//         {loading ? (
//           <div className="p-4 text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-2">Loading grievances...</p>
//           </div>
//         ) : grievances.length === 0 ? (
//           <div className="p-4 text-gray-500">No grievances found.</div>
//         ) : (
//           <AdminGrievanceList
//             grievances={grievances}
//             faculties={faculties}
//             facultyLoading={facultyLoading}
//             onAssignFaculty={handleAssignFaculty}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import AdminGrievanceList from "../components/admin/AdminGrievanceList";
import Filters from "../components/admin/Filters";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const { user, api } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    month: "",
    year: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch grievances and faculties on component mount and filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setFacultyLoading(true);

        const params = new URLSearchParams();
        if (filters.department) params.append("department", filters.department);
        if (filters.status) params.append("status", filters.status);
        if (filters.month) params.append("month", filters.month);
        if (filters.year) params.append("year", filters.year);
        if (filters.fromDate) params.append("fromDate", filters.fromDate);
        if (filters.toDate) params.append("toDate", filters.toDate);

        const [grievancesRes, facultiesRes] = await Promise.all([
          api.get(`/api/admin/grievances?${params.toString()}`),
          api.get("/api/admin/faculty"),
        ]);

        setGrievances(grievancesRes.data);
        setFaculties(facultiesRes.data);
      } catch (err) {
        console.error(err.response?.data?.msg || "Error fetching data");
      } finally {
        setLoading(false);
        setFacultyLoading(false);
      }
    };

    fetchData();
  }, [filters, api]);

  const handleAssignFaculty = async (grievanceId, facultyId) => {
    try {
      await api.put(`/api/admin/grievances/${grievanceId}/assign`, {
        facultyId,
      });

      // Update local state
      const updatedGrievances = grievances.map((g) =>
        g._id === grievanceId
          ? {
              ...g,
              assignedTo: faculties.find((f) => f._id === facultyId),
              status: "assigned",
            }
          : g
      );

      setGrievances(updatedGrievances);
    } catch (err) {
      console.error(err.response?.data?.msg || "Error assigning faculty");
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const params = new URLSearchParams();
  //     if (filters.department) params.append('department', filters.department);
  //     if (filters.status) params.append('status', filters.status);
  //     if (filters.fromDate) params.append('fromDate', filters.fromDate);
  //     if (filters.toDate) params.append('toDate', filters.toDate);

  //     // Open export in new tab
  //     window.open(
  //       `/api/admin/grievances/export?${params.toString()}`,
  //       '_blank'
  //     );
  //   } catch (err) {
  //     console.error('Export failed:', err);
  //     alert('Failed to export data. Please try again.');
  //   }
  // };

  const handleExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.status) params.append("status", filters.status);
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);

      // Use your authenticated api instance
      const response = await api.get(
        `/api/admin/grievances/export?${params.toString()}`,
        {
          responseType: "blob", // Important for file downloads
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Explicitly add token
          },
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `grievances_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please ensure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleExport}
          disabled={loading}
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export to Excel
        </button>
      </div>

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
