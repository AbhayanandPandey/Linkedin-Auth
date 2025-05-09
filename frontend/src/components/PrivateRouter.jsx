import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
  const token = Cookies.get('LinkedInToken'); // Get the token from cookies
  if (!token) {
    return <Navigate to="/" replace />; 
  }
  return children; 
}