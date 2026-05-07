import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';

const AppInicio: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f69b4', '--color': '#ffffff' }}>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Mi Portal Ciudadano
            </h5>
            <small style={{ fontFamily: "'Roboto', sans-serif", color: '#e0e0e0' }}>
              Municipalidad de Santo Domingo
            </small>
          </div>
          {/* Botón para simular cierre de sesión */}
          <IonButtons slot="end">
            <IonButton routerLink="/login" style={{ color: '#ffffff' }}>
              Salir
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          
          <div className="row mb-4">
            <div className="col-12">
              <h3 style={{ fontFamily: "'Roboto Slab', serif", color: '#333' }}>
                ¡Hola! Bienvenido a tu panel
              </h3>
              <p className="text-muted" style={{ fontFamily: "'Roboto', sans-serif" }}>
                Desde aquí puedes acceder fácilmente a la información financiera del municipio y gestionar tus solicitudes de transparencia.
              </p>
            </div>
          </div>

          {/* Accesos Directos basados en Requerimientos Funcionales */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 style={{ fontFamily: "'Roboto Slab', serif", color: '#0f69b4' }}>
                    Historial de Solicitudes
                  </h5>
                  <p className="text-muted small">
                    Revisa el estado de las solicitudes de información que has enviado a la municipalidad.
                  </p>
                  <IonButton routerLink="/app/solicitudes" expand="block" style={{ '--background': '#0f69b4' }}>
                    Ver mis solicitudes
                  </IonButton>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 style={{ fontFamily: "'Roboto Slab', serif", color: '#28a745' }}>
                    Exportar Datos Abiertos
                  </h5>
                  <p className="text-muted small">
                    Accede al catálogo para descargar la información financiera automatizada en formatos CSV, JSON y XML.
                  </p>
                  <button className="btn btn-outline-success w-100">
                    Ir al catálogo
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppInicio;