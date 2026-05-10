import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
} from '@ionic/react';
import { personOutline, arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const usuarios = [
  { nombre: 'Ana López',        rut: '12.345.678-9', rol: 'Ciudadano',    email: 'ana.lopez@ejemplo.cl',      estado: 'Activo'    },
  { nombre: 'Carlos Muñoz',     rut: '15.678.901-2', rol: 'Ciudadano',    email: 'c.munoz@ejemplo.cl',        estado: 'Activo'    },
  { nombre: 'María Fernández',  rut: '10.234.567-8', rol: 'Administrador', email: 'm.fernandez@muni.cl',      estado: 'Activo'    },
  { nombre: 'Pedro Soto',       rut: '18.901.234-5', rol: 'Ciudadano',    email: 'pedro.soto@ejemplo.cl',     estado: 'Inactivo'  },
];

const badgeColor: Record<string, { bg: string; color: string }> = {
  Activo:   { bg: '#d1e7dd', color: '#0f5132' },
  Inactivo: { bg: '#f8d7da', color: '#842029' },
};

const rolColor: Record<string, { bg: string; color: string }> = {
  Ciudadano:     { bg: '#e8f4fd', color: '#1a9cd8' },
  Administrador: { bg: '#e8f0fe', color: '#15305b' },
};

const AdminUsuario: React.FC = () => {
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
            <IonButton fill="clear" onClick={() => history.push('/admin/dashboard')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Administración de Usuarios</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Gestión de cuentas y perfiles del sistema
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
                Usuarios Registrados
              </h3>
            </div>

            {usuarios.map((u, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 24px', borderBottom: i < usuarios.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IonIcon icon={personCircleOutline} style={{ color: '#15305b', fontSize: '28px' }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{u.nombre}</p>
                  <p style={{ margin: '2px 0 0', color: '#888', fontSize: '12px' }}>{u.rut} · {u.email}</p>
                </div>
                {/* Rol */}
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: rolColor[u.rol].bg, color: rolColor[u.rol].color, flexShrink: 0,
                }}>
                  {u.rol}
                </span>
                {/* Estado */}
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: badgeColor[u.estado].bg, color: badgeColor[u.estado].color, flexShrink: 0,
                }}>
                  {u.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuario;