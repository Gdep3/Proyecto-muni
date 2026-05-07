import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonButton
} from '@ionic/react';

const AdminDashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        {/* Usamos el color oscuro para denotar el área administrativa/gestión */}
        <IonToolbar style={{ '--background': '#343a40', '--color': '#ffffff' }}>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Panel de Control Administrativo
            </h5>
            <small style={{ fontFamily: "'Roboto', sans-serif", color: '#adb5bd' }}>
              Gestión Interna - Santo Domingo
            </small>
          </div>
          <IonButtons slot="end">
            <IonButton routerLink="/login" style={{ color: '#ffffff' }}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8f9fa' }}>
        <div className="container mt-4 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h3 style={{ fontFamily: "'Roboto Slab', serif", color: '#333' }}>Métricas de Gestión</h3>
            </div>
          </div>

          {/* Tarjetas de Indicadores Clave */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm bg-primary text-white">
                <div className="card-body">
                  <h6>Solicitudes Totales</h6>
                  <h2>154</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm bg-warning text-dark">
                <div className="card-body">
                  <h6>Pendientes de Revisión</h6>
                  <h2>28</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm bg-success text-white">
                <div className="card-body">
                  <h6>Tasa de Respuesta</h6>
                  <h2>94.2%</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Accesos de Gestión */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 style={{ fontFamily: "'Roboto Slab', serif" }}>Bandeja de Requerimientos</h5>
                  <p className="text-muted small">Revisar, clasificar y responder a las solicitudes de información ciudadana.</p>
                  <IonButton routerLink="/admin/gestion" expand="block" style={{ '--background': '#343a40' }}>
                    Ir a Gestión
                  </IonButton>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 style={{ fontFamily: "'Roboto Slab', serif" }}>Mantenedor de Cuentas</h5>
                  <p className="text-muted small">Administración de perfiles de usuarios y niveles de privilegios en el sistema.</p>
                  <IonButton routerLink="/admin/usuarios" expand="block" fill="outline" style={{ '--color': '#343a40', '--border-color': '#343a40' }}>
                    Gestionar Usuarios
                  </IonButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;