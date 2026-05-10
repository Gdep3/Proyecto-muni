import React from 'react';
import { IonHeader, IonToolbar } from '@ionic/react';

const HeaderLinks: React.FC = () => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar style={{ '--background': '#15305b', '--color': '#ffffff' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '28px',
          padding: '10px 30px',
          fontSize: '13px',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}>
          <span style={{ cursor: 'pointer' }}>Plataforma Ley Lobby</span>
          <span style={{ cursor: 'pointer' }}>Transparencia Activa</span>
          <span style={{ cursor: 'pointer' }}>Solicitud Ley de Transparencia</span>
          <span style={{ cursor: 'pointer' }}>Decretos</span>
          <span style={{ color: '#f1c40f', fontWeight: 'bold', cursor: 'pointer' }}>
            Consejo Municipal en VIVO
          </span>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderLinks;