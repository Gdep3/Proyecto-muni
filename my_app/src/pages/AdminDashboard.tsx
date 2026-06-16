import React from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButton, IonIcon, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  peopleOutline, documentTextOutline, globeOutline, personOutline, logOutOutline
} from 'ionicons/icons';

const AdminDashboard: React.FC = () => {
  const history = useHistory();

  const cerrarSesion = () => {
    // Si tuvieras un token guardado, aquí se borraría: localStorage.removeItem('token');
    history.push('/'); // Volvemos a la pantalla de inicio principal
    window.location.reload(); // Recargamos para limpiar los estados de sesión
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white' }}>
          <div slot="start" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '16px' }}>
            <img 
              src="/SantoDomingoIcono.png" 
              alt="Logo Santo Domingo" 
              style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                Municipalidad de
              </span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.1' }}>
                Santo Domingo
              </span>
            </div>
          </div>

          {/* Título del Panel */}
          <IonTitle style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textAlign: 'center', 
            padding: '0',
            width: 'auto'
          }}>
            Panel de Control
          </IonTitle>

          
          {/* Botón de Perfil del Administrador */}
          <IonButtons slot="end" style={{ marginRight: '8px' }}>
            <IonButton 
              style={{ color: 'white' }} 
              onClick={() => history.push('/admin/perfil')}
            >
              <IonIcon slot="icon-only" icon={personOutline} style={{ fontSize: '24px' }} />
            </IonButton>
          </IonButtons>

        </IonToolbar>
      </IonHeader>
      

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#15305b', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            Bienvenido al Centro de Control
          </h2>
          <p style={{ color: '#666', margin: '0' }}>
            Gestiona usuarios y solicitudes de la Municipalidad de Santo Domingo.
          </p>
        </div>

        <IonGrid style={{ maxWidth: '800px', margin: '0 auto' }}>
          <IonRow>
            {/* Tarjeta: Gestión de Usuarios */}
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/admin/usuarios')} style={{ borderRadius: '15px', height: '100%', margin: '10px 0' }}>
                <IonCardHeader>
                  <IonIcon icon={peopleOutline} style={{ fontSize: '45px', color: '#1a9cd8' }} />
                  <IonCardTitle style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>Gestión de Usuarios</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ fontSize: '14px', color: '#555' }}>
                  Administra los roles, asciende a nuevos administradores y revisa las cuentas registradas en la plataforma.
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Tarjeta: Gestión de Solicitudes */}
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/admin/gestion')} style={{ borderRadius: '15px', height: '100%', margin: '10px 0' }}>
                <IonCardHeader>
                  <IonIcon icon={documentTextOutline} style={{ fontSize: '45px', color: '#1a9cd8' }} />
                  <IonCardTitle style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>Trámites y Solicitudes</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ fontSize: '14px', color: '#555' }}>
                  Revisa, gestiona y responde las solicitudes de Ley de Transparencia enviadas por los ciudadanos.
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Botón: Ir al Portal Público */}
            <IonCol size="12">
              <IonButton 
                expand="block" 
                onClick={() => history.push('/')}
                style={{ 
                  '--background': '#28a745', 
                  '--color': 'white',
                  '--border-radius': '12px', 
                  height: '60px', 
                  marginTop: '20px', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <IonIcon slot="start" icon={globeOutline} style={{ fontSize: '24px' }} />
                Ir al Portal Público
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;