import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.user.isAuth);

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
