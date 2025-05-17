import { useState } from 'react';
import { format } from 'date-fns';
import ResponseModal from './ResponseModal';

export default function FacultyGrievanceList({ grievances, onRespond }) {
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRespondClick = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  return (
    <div className="divide-y divide-gray-200">
      {grievances.map(grievance => (
        <div key={grievance._id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{grievance.title}</h3>
              <div className="mt-1 text-sm">
                <span className="text-gray-600">Student: </span>
                <span className="font-medium">{grievance.student.name}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">Reg No: </span>
                <span className="font-medium">{grievance.student.registrationNumber}</span>
              </div>
              
              <div className="mt-1 text-sm">
                <span className="text-gray-600">Program: </span>
                <span className="font-medium">{grievance.student.program}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">Dept: </span>
                <span className="font-medium">{grievance.department}</span>
              </div>
              
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
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {format(new Date(grievance.createdAt), 'MMM d, yyyy')}
              </div>
              {grievance.status !== 'resolved' && (
                <button
                  onClick={() => handleRespondClick(grievance)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Respond
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => {
                const el = document.getElementById(`details-${grievance._id}`);
                el.classList.toggle('hidden');
              }}
            >
              View Details
            </button>
            
            <div id={`details-${grievance._id}`} className="hidden mt-2 p-3 bg-gray-100 rounded">
              <p className="text-gray-700">{grievance.description}</p>
              
              {grievance.response && (
                <div className="mt-3 p-3 bg-gray-200 rounded">
                  <h4 className="font-medium">Your Response:</h4>
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
        </div>
      ))}
      
      {isModalOpen && selectedGrievance && (
        <ResponseModal
          grievance={selectedGrievance}
          onClose={() => setIsModalOpen(false)}
          onRespond={onRespond}
        />
      )}
    </div>
  );
}