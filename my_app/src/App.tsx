import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// 1. PÁGINAS PÚBLICAS
import Login from './pages/Login';
import Registro from './pages/Registro';
import InicioPublico from './pages/InicioPublico';

// 2. PÁGINAS ÁREA PRIVADA (CIUDADANO - /app)
import AppInicio from './pages/AppInicio';
import AppSolicitudes from './pages/AppSolicitudes';
import AppNuevaSolicitud from './pages/AppNuevaSolicitud';
import AppPerfil from './pages/AppPerfil';

// 3. PÁGINAS ÁREA PRIVADA (ADMINISTRADOR - /admin)
import AdminDashboard from './pages/AdminDashboard';
import AdminGestion from './pages/AdminGestion';
import AdminUsuario from './pages/AdminUsuario';

// Componente de Ruta Protegida (Lo creamos en el paso anterior)
import PrivateRoute from './routes/PrivateRoute';

// CSS nativo de Ionic
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => {
  // Simulación de estados de sesión según tu arquitectura
  const [isAuth, setIsAuth] = useState(false); 
  const [userRole, setUserRole] = useState<'ciudadano' | 'admin'>('ciudadano');

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          
          {/*RAÍZ PÚBLICA*/}
          <Route exact path="/inicio" component={InicioPublico} />    
          <Route exact path="/login" component={Login} />
          <Route exact path="/registro" component={Registro} />

          {/*ÁREA PRIVADA - ROL CIUDADANO (/app) */}
          <PrivateRoute exact path="/app/inicio" component={AppInicio} isAuthenticated={isAuth} />
          <PrivateRoute exact path="/app/solicitudes" component={AppSolicitudes} isAuthenticated={isAuth} />
          <PrivateRoute exact path="/app/solicitudes/nueva" component={AppNuevaSolicitud} isAuthenticated={isAuth} />
          <PrivateRoute exact path="/app/perfil" component={AppPerfil} isAuthenticated={isAuth} />

          {/*aREA PRIVADA - ROL FUNCIONARIO (/admin)*/}
          <PrivateRoute exact path="/admin/dashboard" component={AdminDashboard} isAuthenticated={isAuth} />
          <PrivateRoute exact path="/admin/gestion" component={AdminGestion} isAuthenticated={isAuth} />
          <PrivateRoute exact path="/admin/usuarios" component={AdminUsuario} isAuthenticated={isAuth} />

          {/*REDIRECCIÓN POR DEFECTO*/}
          <Route exact path="/">
            <Redirect to="/inicio" />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;