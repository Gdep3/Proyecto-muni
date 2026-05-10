import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
} from '@ionic/react';
import { personOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const solicitudes = [
  { folio: '#45192', asunto: 'Ejecución presupuestaria Q1 2026',    fecha: '10/05/2026', estado: 'Pendiente'  },
  { folio: '#45120', asunto: 'Certificado de Obras (Ampliación)',   fecha: '15/04/2026', estado: 'Respondida' },
  { folio: '#45088', asunto: 'Detalle Gasto Salud Marzo 2026',      fecha: '02/04/2026', estado: 'Respondida' },
  { folio: '#45071', asunto: 'Comparativa Presupuesto Obras 2024-2025', fecha: '28/03/2026', estado: 'Pendiente' },
];

const badgeColor: Record<string, { bg: string; color: string }> = {
  Pendiente:  { bg: '#fff3cd', color: '#856404' },
  Respondida: { bg: '#d1e7dd', color: '#0f5132' },
};

const AdminGestion: React.FC = () => {
  const history = useHistory();
  const [filtro, setFiltro] = useState('Todos');

  const filtrados = filtro === 'Todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtro);

  return (
    <IonPage>
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
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

        {/* ── CONTENIDO ── */}
        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>

          {/* Card tabla */}
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            {/* Header de la card con filtro */}
            <div style={{
              padding: '20px 24px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                Gestión de Solicitudes
              </h3>
              <select
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: '1px solid #ddd',
                  fontSize: '13px', color: '#333', backgroundColor: '#f9f9f9', outline: 'none',
                }}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Respondida">Respondida</option>
              </select>
            </div>

            {/* Tabla */}
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
                  {filtrados.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#15305b' }}>{s.folio}</td>
                      <td style={{ padding: '16px 20px', color: '#333' }}>{s.asunto}</td>
                      <td style={{ padding: '16px 20px', color: '#777' }}>{s.fecha}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                          backgroundColor: badgeColor[s.estado].bg, color: badgeColor[s.estado].color,
                        }}>
                          {s.estado}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button style={{
                          padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                          fontSize: '13px', fontWeight: '600',
                          backgroundColor: s.estado === 'Pendiente' ? '#15305b' : '#f0f2f5',
                          color: s.estado === 'Pendiente' ? 'white' : '#555',
                        }}>
                          {s.estado === 'Pendiente' ? 'Gestionar' : 'Ver'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminGestion;