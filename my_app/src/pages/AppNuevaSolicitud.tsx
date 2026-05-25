import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonToast,
} from '@ionic/react';
import { personOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { solicitudesService } from '../services/api';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '1px solid #ddd', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', color: '#333', backgroundColor: 'white', fontFamily: 'inherit',
};

const AppNuevaSolicitud: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading]     = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError]         = useState('');
  const [form, setForm] = useState({ categoria: '', asunto: '', descripcion: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const nueva = await solicitudesService.crear(form);
      setShowToast(true);
      setTimeout(() => history.push(`/app/solicitudes/${nueva.id}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

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
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Ingresar Requerimiento</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>Solicitud de información financiera</p>
            </div>
          </div>
          <IonButton color="light" style={{
            width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '28px 24px' }}>
            <h3 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1a1a2e', fontSize: '17px' }}>Detalle de la Solicitud</h3>
            <p style={{ margin: '0 0 24px', color: '#888', fontSize: '13px' }}>Complete los datos para solicitar información a la Municipalidad.</p>

            {error && <div style={{ backgroundColor: '#f8d7da', borderRadius: '10px', padding: '12px', color: '#842029', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Categoría</label>
                <select name="categoria" required value={form.categoria} onChange={handleChange}
                  style={{ ...inputStyle, appearance: 'auto' }}>
                  <option value="" disabled>Seleccione una categoría...</option>
                  <option value="finanzas">Transparencia Financiera (Presupuestos)</option>
                  <option value="obras">Obras y Urbanismo</option>
                  <option value="educacion">Educación Pública</option>
                  <option value="salud">Salud Municipal</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Asunto</label>
                <input type="text" name="asunto" placeholder="Ej: Ejecución presupuestaria Q1 2026"
                  required value={form.asunto} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Descripción</label>
                <textarea name="descripcion" rows={5} required value={form.descripcion} onChange={handleChange}
                  placeholder="Especifique qué datos necesita..."
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', backgroundColor: '#006FB3', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>
        </div>

        <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)}
          message="¡Solicitud ingresada correctamente!" duration={1500} color="success" />
      </IonContent>
    </IonPage>
  );
};

export default AppNuevaSolicitud;