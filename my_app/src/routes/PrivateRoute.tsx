import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component?: React.FC<any>;
  render?: () => React.ReactNode;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean;
  requiredRole?: 'ciudadano' | 'admin';
  userRole?: 'ciudadano' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  render,
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
          return <Redirect to={userRole === 'admin' ? '/admin/dashboard' : '/app/inicio'} />;
        }
        if (render) return render();
        return Component ? <Component /> : null;
      }}
    />
  );
};

export default PrivateRoute;