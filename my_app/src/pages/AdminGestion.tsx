import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/react';

const AdminGestion: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#343a40', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/dashboard" text="Volver" style={{ color: '#ffffff' }} />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Bandeja de Entrada
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f8f9fa' }}>
        <div className="container mt-4">
          <div className="row mb-4 align-items-center">
            <div className="col-md-6">
              <h4 style={{ fontFamily: "'Roboto Slab', serif" }}>Gestión de Solicitudes</h4>
            </div>
            <div className="col-md-6 text-right">
              {/* Simulación del filtro mencionado en el README */}
              <select className="custom-select w-50">
                <option value="todos">Todos los estados</option>
                <option value="pendiente" selected>Pendiente</option>
                <option value="respondida">Respondida</option>
              </select>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: '#f1f3f5' }}>
                  <tr>
                    <th>Folio</th>
                    <th>Asunto</th>
                    <th>Ingreso</th>
                    <th>Estado</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#45192</td>
                    <td>Ejecución presupuestaria Q1 2026</td>
                    <td>10/05/2026</td>
                    <td><span className="badge badge-warning">Pendiente</span></td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-primary">Gestionar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#45120</td>
                    <td>Certificado de Obras (Ampliación)</td>
                    <td>15/04/2026</td>
                    <td><span className="badge badge-success">Respondida</span></td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-secondary">Ver</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminGestion;