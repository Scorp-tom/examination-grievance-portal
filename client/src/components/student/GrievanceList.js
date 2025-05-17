import { format } from 'date-fns';

export default function GrievanceList({ grievances }) {
  return (
    <div className="divide-y divide-gray-200">
      {grievances.map(grievance => (
        <div key={grievance._id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{grievance.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{grievance.description}</p>
              
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  {grievance.department}
                </span>
                <span className={`inline-block text-xs px-2 py-1 rounded mr-2 ${
                  grievance.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                  grievance.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {grievance.status}
                </span>
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
              {grievance.assignedTo && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Assigned to: </span>
                  <span className="font-medium">{grievance.assignedTo.name}</span>
                </div>
              )}
            </div>
          </div>
          
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
      ))}
    </div>
  );
}