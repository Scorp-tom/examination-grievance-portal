import { useState } from 'react';
import { format } from 'date-fns';
import AssignFacultyModal from './AssignFacultyModal';

export default function AdminGrievanceList({ grievances, onAssignFaculty }) {
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssignClick = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  return (
    <div className="divide-y divide-gray-200">
      {grievances.map(grievance => (
        <div key={grievance._id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-lg mr-2">{grievance.title}</h3>
                <span className={`inline-block text-xs px-2 py-1 rounded ${
                  grievance.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                  grievance.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {grievance.status}
                </span>
              </div>
              
              <div className="mt-1 text-sm">
                <span className="text-gray-600">Student: </span>
                <span className="font-medium">{grievance.student.name}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">Dept: </span>
                <span className="font-medium">{grievance.department}</span>
              </div>
              
              {grievance.assignedTo && (
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Assigned to: </span>
                  <span className="font-medium">{grievance.assignedTo.name}</span>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {format(new Date(grievance.createdAt), 'MMM d, yyyy')}
              </div>
              {grievance.status === 'open' && (
                <button
                  onClick={() => handleAssignClick(grievance)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Assign Faculty
                </button>
              )}
            </div>
          </div>
          
          {grievance.status !== 'open' && (
            <div className="mt-3">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => {
                  const el = document.getElementById(`details-${grievance._id}`);
                  el.classList.toggle('hidden');
                }}
              >
                {grievance.status === 'resolved' ? 'View Details' : 'View Grievance'}
              </button>
              
              <div id={`details-${grievance._id}`} className="hidden mt-2 p-3 bg-gray-50 rounded">
                <p className="text-gray-700">{grievance.description}</p>
                
                {grievance.subjects && grievance.subjects.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Subjects:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {grievance.subjects.map((subject, index) => (
                        <li key={index}>{subject.code} - {subject.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {grievance.response && (
                  <div className="mt-3 p-3 bg-gray-100 rounded">
                    <h4 className="font-medium">Response:</h4>
                    <p className="text-gray-700">{grievance.response}</p>
                    {grievance.resolvedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Resolved on: {format(new Date(grievance.resolvedAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isModalOpen && selectedGrievance && (
        <AssignFacultyModal
          grievance={selectedGrievance}
          onClose={() => setIsModalOpen(false)}
          onAssign={onAssignFaculty}
        />
      )}
    </div>
  );
}