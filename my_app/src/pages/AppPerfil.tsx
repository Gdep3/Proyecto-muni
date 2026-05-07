import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/react';

const AppPerfil: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f69b4', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/inicio" text="Volver" style={{ color: '#ffffff' }} />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Mi Perfil
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px', backgroundColor: '#0f69b4', fontSize: '24px', fontWeight: 'bold' }}
                    >
                      AL
                    </div>
                    <div className="ml-3">
                      <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0 }}>Ana López</h5>
                      <small className="text-muted">Ciudadano Registrado</small>
                    </div>
                  </div>

                  <form>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold text-muted small">RUT</label>
                      <input type="text" className="form-control" value="12.345.678-9" disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold text-muted small">Correo Electrónico</label>
                      <input type="email" className="form-control" defaultValue="ana.lopez@ejemplo.cl" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label font-weight-bold text-muted small">Comuna</label>
                      <input type="text" className="form-control" defaultValue="Santo Domingo" />
                    </div>

                    <button type="button" className="btn btn-outline-primary w-100" style={{ borderColor: '#0f69b4', color: '#0f69b4' }}>
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppPerfil;