
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { admin } = useAuth();
  
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
