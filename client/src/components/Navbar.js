import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Grievance Portal</Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user.role === 'student' && (
                <Link to="/student" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'faculty' && (
                <Link to="/faculty" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Faculty Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}