import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonButton
} from '@ionic/react';

const InicioPublico: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f69b4', '--color': '#ffffff' }}>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Portal de Transparencia - Santo Domingo
            </h5>
          </div>
          <IonButtons slot="end">
            <IonButton routerLink="/login" className="btn-light text-primary" style={{ fontWeight: 'bold' }}>
              Iniciar Sesión
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h2 style={{ fontFamily: "'Roboto Slab', serif", color: '#333' }}>Datos Abiertos Financieros</h2>
              <p className="lead text-muted">Acceso libre a la ejecución presupuestaria y gestión de recursos municipales.</p>
            </div>
          </div>

          {/* Resumen de Datos Abiertos (Visualización automatizada según requerimiento) */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#0f69b4' }}>Presupuesto Anual 2026</h5>
                  <div className="p-4 bg-light text-center rounded">
                    <h3 className="mb-0">$12.450.000.000</h3>
                    <small className="text-success">↑ 4.2% respecto al año anterior</small>
                  </div>
                  <button className="btn btn-outline-primary btn-sm mt-3 w-100">Ver Gráficos Comparativos</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#28a745' }}>Descarga de Datasets (CSV/JSON)</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center small">
                      Gastos en Educación Q1
                      <button className="btn btn-sm btn-link">CSV</button>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center small">
                      Inversión en Obras Públicas
                      <button className="btn btn-sm btn-link">XML</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InicioPublico;