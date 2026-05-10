import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
  IonLoading, IonToast,
} from '@ionic/react';
import { personOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '1px solid #ddd', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', color: '#333', backgroundColor: 'white',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px', fontWeight: '600', color: '#444',
  display: 'block', marginBottom: '6px',
};

const AppNuevaSolicitud: React.FC = () => {
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setShowToast(true);
      setTimeout(() => history.push('/app/solicitudes'), 1500);
    }, 2000);
  };

  return (
    <IonPage>
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 110px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IonButton fill="clear" onClick={() => history.push('/app/solicitudes')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Ingresar Requerimiento</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Solicitud de información financiera
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
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '28px 24px',
          }}>
            <h3 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1a1a2e', fontSize: '17px' }}>
              Detalle de la Solicitud
            </h3>
            <p style={{ margin: '0 0 24px', color: '#888', fontSize: '13px' }}>
              Complete los datos para solicitar información a la Municipalidad de Santo Domingo.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Categoría de la Información</label>
                <select required defaultValue="" style={{ ...inputStyle, appearance: 'auto' }}>
                  <option value="" disabled>Seleccione una categoría...</option>
                  <option value="finanzas">Transparencia Financiera (Presupuestos)</option>
                  <option value="obras">Obras y Urbanismo</option>
                  <option value="educacion">Educación Pública</option>
                  <option value="salud">Salud Municipal</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Asunto</label>
                <input
                  type="text"
                  placeholder="Ej: Ejecución presupuestaria Q1 2026"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Descripción detallada</label>
                <textarea
                  rows={5}
                  placeholder="Especifique qué datos necesita, periodos a comparar o formatos preferidos..."
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={showLoading}
                style={{
                  width: '100%', padding: '14px', backgroundColor: '#15305b', color: 'white',
                  border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
                  cursor: showLoading ? 'not-allowed' : 'pointer', opacity: showLoading ? 0.7 : 1,
                }}
              >
                {showLoading ? 'Procesando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>
        </div>

        <IonLoading isOpen={showLoading} message="Registrando solicitud en el sistema..." spinner="crescent" />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Solicitud ingresada correctamente. Folio #45192."
          duration={2000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default AppNuevaSolicitud;