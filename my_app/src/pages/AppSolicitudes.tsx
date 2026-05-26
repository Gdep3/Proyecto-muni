import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
  IonFab, IonFabButton, IonSpinner,
} from '@ionic/react';
import { personOutline, arrowBackOutline, add, arrowForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { solicitudesService } from '../services/api';

const estadoConfig: Record<string, { bg: string; color: string }> = {
  respondida: { bg: '#d1e7dd', color: '#0f5132' },
  pendiente:  { bg: '#fff3cd', color: '#856404' },
};

const AppSolicitudes: React.FC = () => {
  const history = useHistory();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    solicitudesService.listar()
      .then(data => setSolicitudes(data))
      .catch(() => setError('Error al cargar las solicitudes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b' }}>
          <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            gap: '28px', padding: '10px 30px', fontSize: '13px', color: '#ffffff',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}>
            <span style={{ cursor: 'pointer' }}>Plataforma Ley Lobby</span>
            <span style={{ cursor: 'pointer' }}>Transparencia Activa</span>
            <span style={{ cursor: 'pointer' }}>Solicitud Ley de Transparencia</span>
            <span style={{ cursor: 'pointer' }}>Decretos</span>
            <span style={{ color: '#f1c40f', fontWeight: 'bold', cursor: 'pointer' }}>Consejo Municipal en VIVO</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f0f2f5' }}>
        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 100px 30px', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IonButton fill="clear" onClick={() => history.push('/app/inicio')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Mis Solicitudes</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>Historial de requerimientos</p>
            </div>
          </div>
          <IonButton color="light" onClick={() => history.push('/app/perfil')} style={{
            width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        <div style={{ marginTop: '-70px', padding: '0 24px 100px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><IonSpinner name="crescent" /></div>}
          {error && <div style={{ backgroundColor: '#f8d7da', borderRadius: '12px', padding: '16px', color: '#842029' }}>{error}</div>}
          {!loading && !error && solicitudes.length === 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#888' }}>
              No tienes solicitudes aún. ¡Crea una con el botón +!
            </div>
          )}
          {solicitudes.map((s) => {
            const cfg = estadoConfig[s.estado] ?? { bg: '#e9ecef', color: '#495057' };
            return (
              <div key={s.id} style={{
                backgroundColor: 'white', borderRadius: '16px', padding: '20px 24px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)', display: 'flex',
                justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>{s.asunto}</p>
                  <p style={{ margin: '0 0 2px', color: '#888', fontSize: '12px' }}>Folio: {s.folio} · {new Date(s.created_at).toLocaleDateString('es-CL')}</p>
                  <p style={{ margin: '0 0 14px', color: '#888', fontSize: '12px' }}>Categoría: {s.categoria}</p>
                  <button onClick={() => history.push(`/app/solicitudes/${s.id}`)} style={{
                    padding: '6px 16px', borderRadius: '8px', border: '1px solid #15305b',
                    backgroundColor: 'transparent', color: '#15305b', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    Ver detalle <IonIcon icon={arrowForwardOutline} style={{ fontSize: '14px' }} />
                  </button>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
                }}>
                  {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                </span>
              </div>
            );
          })}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ margin: '20px' }}>
          <IonFabButton onClick={() => history.push('/app/solicitudes/nueva')}
            style={{ '--background': '#006FB3' }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default AppSolicitudes;