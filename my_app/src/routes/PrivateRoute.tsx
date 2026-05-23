import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.FC;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean;
  requiredRole?: 'ciudadano' | 'admin';
  userRole?: 'ciudadano' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuthenticated,
  requiredRole,
  userRole,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        if (requiredRole && userRole !== requiredRole) {
          // Redirige al área correcta según su rol
          return <Redirect to={userRole === 'admin' ? '/admin/dashboard' : '/app/inicio'} />;
        }
        return <Component />;
      }}
    />
  );
};

export default PrivateRoute;