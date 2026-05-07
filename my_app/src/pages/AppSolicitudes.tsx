import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react';
// En Ionic 7+, los iconos se importan directamente desde 'ionicons/icons'
import { add } from 'ionicons/icons';

const AppSolicitudes: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f69b4', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/inicio" text="Volver" style={{ color: '#ffffff' }} />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Mis Solicitudes
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          <div className="row mb-3">
            <div className="col-12">
              <p className="text-muted" style={{ fontFamily: "'Roboto', sans-serif" }}>
                Historial de requerimientos de información financiera ingresados al sistema.
              </p>
            </div>
          </div>

          {/* Lista de Solicitudes (Simulando la base de datos) */}
          <div className="row">
            <div className="col-12">
              
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
                      Req. Detalle Gasto Educación 2025
                    </h6>
                    <span className="badge badge-success">Respondida</span>
                  </div>
                  <p className="text-muted small mb-0">Ingresada: 10/04/2026</p>
                  <p className="text-muted small mb-2">Categoría: Finanzas</p>
                  <button className="btn btn-sm btn-outline-primary">Ver detalle</button>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
                      Comparativa Presupuesto Obras 2024-2025
                    </h6>
                    <span className="badge badge-warning text-dark">Pendiente</span>
                  </div>
                  <p className="text-muted small mb-0">Ingresada: 05/05/2026</p>
                  <p className="text-muted small mb-0">Categoría: Urbanismo</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FAB (Floating Action Button) especificado en el Task Flow del README */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ margin: '16px' }}>
          <IonFabButton routerLink="/app/solicitudes/nueva" style={{ '--background': '#0f69b4' }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default AppSolicitudes;