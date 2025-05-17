import { useState, useEffect } from "react";
// import axios from 'axios';
import { useAuth } from "../../context/AuthContext";

export default function AssignFacultyModal({ grievance, onClose, onAssign }) {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [loading, setLoading] = useState(true);

  const { api } = useAuth(); // Use the authenticated api instance

  // const api = axios.create({
  //   baseURL: "http://localhost:5000",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await api.get("/api/admin/faculty");
        setFacultyList(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data?.msg || "Error fetching faculty");
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const handleAssign = () => {
    if (!selectedFaculty) return;
    onAssign(grievance._id, selectedFaculty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Faculty</h2>
        <p className="mb-2">Assign grievance to a faculty member:</p>
        <p className="font-medium mb-4">"{grievance.title}"</p>

        {loading ? (
          <div className="text-center py-4">Loading faculty list...</div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a faculty member</option>
              {facultyList.map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.name} ({faculty.department})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedFaculty}
            className={`px-4 py-2 rounded text-white ${
              selectedFaculty
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
