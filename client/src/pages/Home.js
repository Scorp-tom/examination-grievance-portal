import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Student Grievance Portal</h1>
      
      {isAuthenticated ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h2>
          <p className="text-gray-600 mb-4">
            {user.role === 'student' 
              ? 'Submit your academic grievances and track their status.'
              : user.role === 'faculty'
              ? 'View and respond to assigned student grievances.'
              : 'Manage all student grievances and assign them to faculty members.'}
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Grievance Portal</h2>
          <p className="text-gray-600 mb-6">
            Students can submit their academic grievances, which will be reviewed by faculty and administrators.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </div>
  );
}