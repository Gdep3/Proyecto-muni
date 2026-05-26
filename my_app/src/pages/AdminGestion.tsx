import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner,
} from '@ionic/react';
import { personOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { solicitudesService } from '../services/api';

const badgeColor: Record<string, { bg: string; color: string }> = {
  pendiente:  { bg: '#fff3cd', color: '#856404' },
  respondida: { bg: '#d1e7dd', color: '#0f5132' },
};

const AdminGestion: React.FC = () => {
  const history = useHistory();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [filtro, setFiltro]           = useState('Todos');

  useEffect(() => {
    solicitudesService.listar()
      .then(data => setSolicitudes(data))
      .catch(() => setError('Error al cargar las solicitudes'))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = filtro === 'todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtro);

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
            <IonButton fill="clear" onClick={() => history.push('/admin/dashboard')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Bandeja de Solicitudes</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Gestión de requerimientos ciudadanos
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

        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            {/* Header con filtro */}
            <div style={{
              padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid #f0f0f0',
            }}>
              <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                Gestión de Solicitudes
              </h3>
              <select value={filtro} onChange={e => setFiltro(e.target.value)}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: '1px solid #ddd',
                  fontSize: '13px', color: '#333', backgroundColor: '#f9f9f9', outline: 'none',
                }}>
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="respondida">Respondida</option>
              </select>
            </div>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <IonSpinner name="crescent" style={{ color: '#15305b' }} />
              </div>
            )}

            {error && (
              <div style={{ padding: '20px', color: '#842029', backgroundColor: '#f8d7da' }}>
                {error}
              </div>
            )}

            {!loading && !error && filtradas.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                No hay solicitudes para mostrar.
              </div>
            )}

            {!loading && !error && filtradas.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      {['Folio', 'Asunto', 'Ingreso', 'Estado', 'Acción'].map(h => (
                        <th key={h} style={{
                          padding: '14px 20px', textAlign: 'left', fontWeight: '600',
                          color: '#555', fontSize: '12px', textTransform: 'uppercase',
                          letterSpacing: '0.5px', borderBottom: '1px solid #eee',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((s) => {
                      const cfg = badgeColor[s.estado] ?? { bg: '#e9ecef', color: '#495057' };
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '16px 20px', fontWeight: '600', color: '#15305b' }}>{s.folio}</td>
                          <td style={{ padding: '16px 20px', color: '#333' }}>{s.asunto}</td>
                          <td style={{ padding: '16px 20px', color: '#777' }}>
                            {new Date(s.created_at).toLocaleDateString('es-CL')}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                              backgroundColor: cfg.bg, color: cfg.color,
                            }}>
                              {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <button
                              onClick={() => history.push(`/admin/gestion/${s.id}`)}
                              style={{
                                padding: '6px 16px', borderRadius: '8px', border: 'none',
                                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                                backgroundColor: s.estado === 'pendiente' ? '#15305b' : '#f0f2f5',
                                color: s.estado === 'pendiente' ? 'white' : '#555',
                              }}>
                              {s.estado === 'pendiente' ? 'Gestionar' : 'Ver'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminGestion;