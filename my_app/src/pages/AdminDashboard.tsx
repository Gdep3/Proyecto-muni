import React from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
} from '@ionic/react';
import {
  personOutline, documentTextOutline, peopleOutline,
  checkmarkCircleOutline, timeOutline, trendingUpOutline, shareOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

/* ─── Componente ───────────────────────────────────────────────── */
const AdminDashboard: React.FC = () => {
  const history = useHistory();

  const kpis = [
    { label: 'Solicitudes Totales', valor: '154', color: '#1a9cd8', icon: documentTextOutline },
    { label: 'Pendientes de Revisión', valor: '28', color: '#f0a500', icon: timeOutline },
    { label: 'Tasa de Respuesta', valor: '94.2%', color: '#27ae60', icon: trendingUpOutline },
  ];

  const accesos = [
    {
      titulo: 'Bandeja de Requerimientos',
      desc: 'Revisar, clasificar y responder las solicitudes de información ciudadana.',
      ruta: '/admin/gestion',
      label: 'Ir a Gestión',
      color: '#15305b',
    },
    {
      titulo: 'Mantenedor de Cuentas',
      desc: 'Administración de perfiles de usuarios y niveles de privilegios.',
      ruta: '/admin/usuarios',
      label: 'Gestionar Usuarios',
      color: '#1a9cd8',
    },
  ];

  return (
    <IonPage>
      {/* ── BARRA SUPERIOR ── */}
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 100px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>
              Panel de Control Administrativo
            </h2>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
              Gestión Interna — Municipalidad de Santo Domingo
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
            type="file"
            id="csv-upload"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8000/documentos/importar', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                });
                const data = await res.json();
                alert(data.mensaje);
              } catch {
                alert('Error al importar el archivo');
              }
            }}
          />
          <IonButton
              color="light"
              onClick={() => document.getElementById('csv-upload')?.click()}
              style={{
                width: '48px', height: '48px', '--border-radius': '50%',
                '--padding-start': '0', '--padding-end': '0',
              }}
            >
              <IonIcon icon={shareOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
            <IonButton color="light" onClick={() => history.push('/admin/perfil')}
               style={{
              width: '48px', height: '48px', '--border-radius': '50%',
              '--padding-start': '0', '--padding-end': '0',
            }}>
              <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>

          {/* KPIs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {kpis.map((k) => (
              <div key={k.label} style={{
                flex: '1 1 180px', backgroundColor: 'white', borderRadius: '16px',
                padding: '20px 24px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: `${k.color}18`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <IonIcon icon={k.icon} style={{ color: k.color, fontSize: '24px' }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '500' }}>{k.label}</p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a1a2e' }}>{k.valor}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Accesos */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {accesos.map((a) => (
              <div key={a.titulo} style={{
                flex: '1 1 280px', backgroundColor: 'white', borderRadius: '16px',
                padding: '28px 24px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              }}>
                <h3 style={{ margin: '0 0 8px', fontWeight: '700', color: '#1a1a2e', fontSize: '17px' }}>
                  {a.titulo}
                </h3>
                <p style={{ margin: '0 0 24px', color: '#777', fontSize: '13px', lineHeight: '1.6' }}>
                  {a.desc}
                </p>
                <IonButton
                  expand="block"
                  onClick={() => history.push(a.ruta)}
                  style={{
                    '--background': a.color, '--border-radius': '12px',
                    '--box-shadow': 'none', fontWeight: '600',
                  }}
                >
                  {a.label}
                </IonButton>
              </div>
            ))}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;