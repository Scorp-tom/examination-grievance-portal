import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function GrievanceForm({ onSubmit }) {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    subjects: [{ code: '', name: '' }]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, department, subjects } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...subjects];
    newSubjects[index][e.target.name] = e.target.value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...subjects, { code: '', name: '' }]
    });
  };

  const removeSubject = (index) => {
    if (subjects.length <= 1) return;
    const newSubjects = subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate at least one subject has both code and name
    const validSubjects = subjects.filter(sub => sub.code && sub.name);
    if (validSubjects.length === 0) {
      setError('Please add at least one subject with both code and name');
      return;
    }

    if (!title || !description || !department) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/grievances', {
        ...formData,
        subjects: validSubjects
      });
      
      onSubmit(response.data);
      setFormData({
        title: '',
        description: '',
        department: '',
        subjects: [{ code: '', name: '' }]
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Submit New Grievance</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title*</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Department*</label>
          <select
            name="department"
            value={department}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Subjects*</label>
          {subjects.map((subject, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                name="code"
                placeholder="Course Code"
                value={subject.code}
                onChange={(e) => handleSubjectChange(index, e)}
                required
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                name="name"
                placeholder="Course Name"
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, e)}
                required
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSubject}
            className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
          >
            Add Another Subject
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Grievance'}
        </button>
      </form>
    </div>
  );
}


// import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// export default function GrievanceForm({ onSubmit }) {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     department: user.department || '',
//     subjects: [{ code: '', name: '' }]
//   });
//   const [error, setError] = useState('');

//   const { title, description, department, subjects } = formData;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubjectChange = (index, e) => {
//     const newSubjects = [...subjects];
//     newSubjects[index][e.target.name] = e.target.value;
//     setFormData({ ...formData, subjects: newSubjects });
//   };

//   const addSubject = () => {
//     setFormData({
//       ...formData,
//       subjects: [...subjects, { code: '', name: '' }]
//     });
//   };

//   const removeSubject = (index) => {
//     const newSubjects = subjects.filter((_, i) => i !== index);
//     setFormData({ ...formData, subjects: newSubjects });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate at least one subject has both code and name
//     const validSubjects = subjects.filter(subject => subject.code && subject.name);
//     if (validSubjects.length === 0) {
//       setError('Please add at least one subject with both code and name');
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:5000/api/grievances', {
//         ...formData,
//         subjects: validSubjects
//       });
//       onSubmit(res.data);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Error submitting grievance');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Submit New Grievance</h2>
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={title}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea
//             name="description"
//             value={description}
//             onChange={handleChange}
//             required
//             rows="4"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Department</label>
//           <input
//             type="text"
//             name="department"
//             value={department}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Subjects</label>
//           {subjects.map((subject, index) => (
//             <div key={index} className="flex space-x-2 mb-2">
//               <input
//                 type="text"
//                 name="code"
//                 placeholder="Course Code"
//                 value={subject.code}
//                 onChange={(e) => handleSubjectChange(index, e)}
//                 className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Course Name"
//                 value={subject.name}
//                 onChange={(e) => handleSubjectChange(index, e)}
//                 className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//               {subjects.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeSubject(index)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addSubject}
//             className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
//           >
//             Add Another Subject
//           </button>
//         </div>
        
//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Submit Grievance
//         </button>
//       </form>
//     </div>
//   );
// }