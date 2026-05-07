import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.FC;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean; // Simulación de estado
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component />
        ) : (
          // Redirección obligatoria si no está logueado 
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;