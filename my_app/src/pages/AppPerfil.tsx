import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
} from '@ionic/react';
import {
  personOutline, arrowBackOutline, personCircleOutline,
  mailOutline, locationOutline, cardOutline, logOutOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 16px', borderRadius: '10px',
  border: '1px solid #ddd', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', color: '#333', backgroundColor: 'white',
  fontFamily: 'inherit',
};

const inputDisabledStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: '#f4f5f8',
  color: '#888',
  cursor: 'not-allowed',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: '600', color: '#888',
  display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px',
};

interface AppPerfilProps {
  onLogout?: () => void;
}

const AppPerfil: React.FC<AppPerfilProps> = ({ onLogout }) => {
  const history = useHistory();
  const [email, setEmail]     = useState('ana.lopez@ejemplo.cl');
  const [comuna, setComuna]   = useState('Santo Domingo');

  return (
    <IonPage>
      {/* ── BARRA SUPERIOR ── */}
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 110px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IonButton fill="clear" onClick={() => history.push('/app/inicio')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Mi Perfil</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Configuración de tu cuenta
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
        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Card avatar */}
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IonIcon icon={personCircleOutline} style={{ color: '#15305b', fontSize: '44px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '17px' }}>Ana López</p>
                <p style={{ margin: '3px 0 0', color: '#888', fontSize: '13px' }}>Ciudadano Registrado</p>
              </div>
            </div>

            {/* Card datos */}
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px',
            }}>
              <h3 style={{ margin: '0 0 20px', fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>
                Información Personal
              </h3>

              {/* RUT (solo lectura) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  <IonIcon icon={cardOutline} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  RUT
                </label>
                <input type="text" value="12.345.678-9" disabled style={inputDisabledStyle} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  <IonIcon icon={mailOutline} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Comuna */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>
                  <IonIcon icon={locationOutline} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Comuna
                </label>
                <input
                  type="text"
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                type="button"
                style={{
                  width: '100%', padding: '13px', backgroundColor: '#15305b', color: 'white',
                  border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Guardar Cambios
              </button>
            </div>

            {/* Card cerrar sesión */}
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '20px 24px',
            }}>
              <button
                type="button"
                onClick={() => { onLogout?.(); history.replace('/inicio'); }}
                style={{
                  width: '100%', padding: '13px', backgroundColor: 'transparent', color: '#e74c3c',
                  border: '1px solid #e74c3c', borderRadius: '12px', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                }}
              >
                <IonIcon icon={logOutOutline} style={{ fontSize: '18px' }} />
                Cerrar Sesión
              </button>
            </div>

          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default AppPerfil;