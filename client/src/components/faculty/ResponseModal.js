import { useState } from 'react';

export default function ResponseModal({ grievance, onClose, onRespond }) {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (!response.trim()) return;
    onRespond(grievance._id, response);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Respond to Grievance</h2>
        <p className="mb-2 font-medium">"{grievance.title}"</p>
        <p className="text-sm text-gray-600 mb-4">Submitted by: {grievance.student.name}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows="5"
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your response to the student's grievance..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className={`px-4 py-2 rounded text-white ${
              response.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
}