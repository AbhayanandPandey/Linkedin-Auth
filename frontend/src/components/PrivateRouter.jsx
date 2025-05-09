import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
  const token = Cookies.get('LinkedInToken');
  if (!token) {
    return <Navigate to="/" replace />; 
  }
  return children; 
}