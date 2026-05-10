import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
  IonFab, IonFabButton,
} from '@ionic/react';
import {
  personOutline, arrowBackOutline, add,
  checkmarkCircleOutline, timeOutline, arrowForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const solicitudes = [
  {
    titulo: 'Req. Detalle Gasto Educación 2025',
    fecha: '10/04/2026',
    categoria: 'Finanzas',
    estado: 'Respondida',
  },
  {
    titulo: 'Comparativa Presupuesto Obras 2024-2025',
    fecha: '05/05/2026',
    categoria: 'Urbanismo',
    estado: 'Pendiente',
  },
];

const estadoConfig: Record<string, { bg: string; color: string; icon: string }> = {
  Respondida: { bg: '#d1e7dd', color: '#0f5132', icon: checkmarkCircleOutline },
  Pendiente:  { bg: '#fff3cd', color: '#856404', icon: timeOutline },
};

const AppSolicitudes: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 100px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IonButton fill="clear" onClick={() => history.push('/app/inicio')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Mis Solicitudes</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Historial de requerimientos ingresados
              </p>
            </div>
          </div>
          <IonButton color="light" style={{
            width: '48px', height: '48px', '--border-radius': '50%',
            '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        <div style={{ marginTop: '-70px', padding: '0 24px 100px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {solicitudes.map((s, i) => {
            const cfg = estadoConfig[s.estado];
            return (
              <div key={i} style={{
                backgroundColor: 'white', borderRadius: '16px',
                padding: '20px 24px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>
                    {s.titulo}
                  </p>
                  <p style={{ margin: '0 0 4px', color: '#888', fontSize: '12px' }}>
                    Ingresada: {s.fecha}
                  </p>
                  <p style={{ margin: '0 0 14px', color: '#888', fontSize: '12px' }}>
                    Categoría: {s.categoria}
                  </p>
                  {s.estado === 'Respondida' && (
                    <button style={{
                      padding: '6px 16px', borderRadius: '8px', border: '1px solid #15305b',
                      backgroundColor: 'transparent', color: '#15305b', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      Ver detalle <IonIcon icon={arrowForwardOutline} style={{ fontSize: '14px' }} />
                    </button>
                  )}
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
                }}>
                  {s.estado}
                </span>
              </div>
            );
          })}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ margin: '20px' }}>
          <IonFabButton
            onClick={() => history.push('/app/solicitudes/nueva')}
            style={{ '--background': '#15305b', '--box-shadow': '0 4px 14px rgba(21,48,91,0.4)' }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default AppSolicitudes;