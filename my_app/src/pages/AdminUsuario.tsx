import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner,
} from '@ionic/react';
import { personOutline, arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usuariosService } from '../services/api';

const rolColor: Record<string, { bg: string; color: string }> = {
  ciudadano:     { bg: '#e8f4fd', color: '#1a9cd8' },
  admin:         { bg: '#e8f0fe', color: '#15305b' },
};

const AdminUsuario: React.FC = () => {
  const history = useHistory();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    usuariosService.listar()
      .then(data => setUsuarios(data))
      .catch(() => setError('Error al cargar los usuarios'))
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
            <IonButton fill="clear" onClick={() => history.push('/admin/dashboard')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Administración de Usuarios</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Gestión de cuentas del sistema
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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                Usuarios Registrados {!loading && `(${usuarios.length})`}
              </h3>
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

            {!loading && !error && usuarios.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                No hay usuarios registrados.
              </div>
            )}

            {usuarios.map((u, i) => {
              const rc = rolColor[u.rol] ?? { bg: '#e9ecef', color: '#495057' };
              return (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 24px',
                  borderBottom: i < usuarios.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IonIcon icon={personCircleOutline} style={{ color: '#15305b', fontSize: '28px' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{u.nombre}</p>
                    <p style={{ margin: '2px 0 0', color: '#888', fontSize: '12px' }}>{u.rut} · {u.email}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: rc.bg, color: rc.color, flexShrink: 0,
                  }}>
                    {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuario;