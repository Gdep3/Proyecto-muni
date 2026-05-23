import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// 1. PÁGINAS PÚBLICAS
import Login from './pages/Login';
import Registro from './pages/Registro';
import InicioPublico from './pages/InicioPublico';
import GraficoAmpliado from './pages/GraficoAmpliado';
import DetalleArchivo from './pages/DetalleArchivo';
import ListaArchivoAmpliada from './pages/ListaArchivoAmpliada';

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
        
        <IonRouterOutlet animated={false}>
          
          {/*RAÍZ PÚBLICA*/}
          <Route exact path="/inicio" render={() => <InicioPublico userRole={isAuth ? userRole : null} />} />
   
          <Route exact path="/login" render={() => (
            <Login onLogin={(role) => { setIsAuth(true); setUserRole(role); }} />
          )} />
          <Route exact path="/lista-ampliada" component={ListaArchivoAmpliada} />
          <Route exact path="/registro" component={Registro} />
          <Route exact path="/detalle-archivo" component={DetalleArchivo} />
          <Route exact path="/grafico-ampliado" component={GraficoAmpliado} />
          
          {/* Rutas ciudadano */}
          <PrivateRoute exact path="/app/inicio"           component={AppInicio}         isAuthenticated={isAuth} requiredRole="ciudadano" userRole={userRole} />
          <PrivateRoute exact path="/app/solicitudes"      component={AppSolicitudes}    isAuthenticated={isAuth} requiredRole="ciudadano" userRole={userRole} />
          <PrivateRoute exact path="/app/solicitudes/nueva" component={AppNuevaSolicitud} isAuthenticated={isAuth} requiredRole="ciudadano" userRole={userRole} />
          <PrivateRoute exact path="/app/perfil"           component={AppPerfil}         isAuthenticated={isAuth} requiredRole="ciudadano" userRole={userRole} />

          {/* Rutas admin */}
          <PrivateRoute exact path="/admin/dashboard" component={AdminDashboard} isAuthenticated={isAuth} requiredRole="admin" userRole={userRole} />
          <PrivateRoute exact path="/admin/gestion"   component={AdminGestion}   isAuthenticated={isAuth} requiredRole="admin" userRole={userRole} />
          <PrivateRoute exact path="/admin/usuarios"  component={AdminUsuario}   isAuthenticated={isAuth} requiredRole="admin" userRole={userRole} />
                    
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