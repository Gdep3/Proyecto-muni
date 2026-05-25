import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner,
} from '@ionic/react';
import { arrowBackOutline, personOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { solicitudesService } from '../services/api';

const estadoConfig: Record<string, { bg: string; color: string; label: string }> = {
  respondida: { bg: '#d1e7dd', color: '#0f5132', label: 'Respondida' },
  pendiente:  { bg: '#fff3cd', color: '#856404', label: 'Pendiente'  },
};

const DetalleSolicitud: React.FC = () => {
  const history             = useHistory();
  const { id }              = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    solicitudesService.obtener(Number(id))
      .then(data => setSolicitud(data))
      .catch(() => setError('No se pudo cargar la solicitud'))
      .finally(() => setLoading(false));
  }, [id]);

  const cfg = solicitud ? (estadoConfig[solicitud.estado] ?? { bg: '#e9ecef', color: '#495057', label: solicitud.estado }) : null;

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
          backgroundColor: '#15305b', padding: '28px 30px 110px 30px', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IonButton fill="clear" onClick={() => history.push('/app/solicitudes')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Detalle de Solicitud</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                {solicitud ? `Folio: ${solicitud.folio}` : ''}
              </p>
            </div>
          </div>
          <IonButton color="light" onClick={() => history.push('/app/perfil')} style={{
            width: '48px', height: '48px', '--border-radius': '50%',
            '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <IonSpinner name="crescent" style={{ color: '#15305b' }} />
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#f8d7da', borderRadius: '12px', padding: '16px', color: '#842029' }}>
              {error}
            </div>
          )}

          {solicitud && cfg && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Card info principal */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '17px' }}>
                    {solicitud.asunto}
                  </h3>
                  <span style={{
                    padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0, marginLeft: '12px',
                  }}>
                    {cfg.label}
                  </span>
                </div>

                {[
                  { label: 'Folio',      valor: solicitud.folio },
                  { label: 'Categoría',  valor: solicitud.categoria },
                  { label: 'Fecha',      valor: new Date(solicitud.created_at).toLocaleDateString('es-CL') },
                ].map(({ label, valor }) => (
                  <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#888', fontWeight: '600', minWidth: '90px' }}>{label}</span>
                    <span style={{ fontSize: '13px', color: '#333' }}>{valor}</span>
                  </div>
                ))}

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888', fontWeight: '600' }}>Descripción</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                    {solicitud.descripcion}
                  </p>
                </div>
              </div>

              {/* Card respuesta */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                  Respuesta de la Municipalidad
                </h3>
                {solicitud.respuesta ? (
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                    {solicitud.respuesta}
                  </p>
                ) : (
                  <div style={{
                    backgroundColor: '#fff3cd', borderRadius: '10px', padding: '16px',
                    color: '#856404', fontSize: '13px',
                  }}>
                    Tu solicitud está siendo procesada. Te notificaremos cuando haya una respuesta.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DetalleSolicitud;