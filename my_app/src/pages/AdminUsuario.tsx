import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton } from '@ionic/react';

const AdminUsuarios: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#343a40', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/dashboard" text="Volver" style={{ color: '#ffffff' }} />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Administración de Usuarios
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="container mt-4">
          <div className="alert alert-info border-0 shadow-sm">
            Como administrador, puede visualizar la lista de ciudadanos y otros funcionarios registrados en el sistema de Santo Domingo.
          </div>
          {/* Aquí podrías listar los usuarios en una tabla similar a la de gestión */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuarios;