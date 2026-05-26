import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
  IonSpinner, IonToast,
} from '@ionic/react';
import { arrowBackOutline, personOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { solicitudesService } from '../services/api';

const AdminGestionDetalle: React.FC = () => {
  const history          = useHistory();
  const { id }           = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [showToast, setShowToast] = useState(false);
  const [estado, setEstado]       = useState('');
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    solicitudesService.obtener(Number(id))
      .then(data => {
        setSolicitud(data);
        setEstado(data.estado);
        setRespuesta(data.respuesta ?? '');
      })
      .catch(() => setError('No se pudo cargar la solicitud'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGuardar = async () => {
    setSaving(true);
    setError('');
    try {
      const actualizada = await solicitudesService.actualizar(Number(id), { estado, respuesta });
      setSolicitud(actualizada);
      setShowToast(true);
      setTimeout(() => history.push('/admin/gestion'), 1500);
    } catch {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
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
            <IonButton fill="clear" onClick={() => history.push('/admin/gestion')}
              style={{ '--padding-start': '0', '--padding-end': '8px', '--color': 'rgba(255,255,255,0.8)' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
            </IonButton>
            <div>
              <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Resolución de Solicitud</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                {solicitud ? `Folio: ${solicitud.folio}` : ''}
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

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <IonSpinner name="crescent" style={{ color: '#15305b' }} />
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#f8d7da', borderRadius: '12px', padding: '16px', color: '#842029', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {solicitud && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Card info solicitud (solo lectura) */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                  Información de la Solicitud
                </h3>
                {[
                  { label: 'Folio',      valor: solicitud.folio },
                  { label: 'Categoría',  valor: solicitud.categoria },
                  { label: 'Asunto',     valor: solicitud.asunto },
                  { label: 'Fecha',      valor: new Date(solicitud.created_at).toLocaleDateString('es-CL') },
                ].map(({ label, valor }) => (
                  <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#888', fontWeight: '600', minWidth: '90px' }}>{label}</span>
                    <span style={{ fontSize: '13px', color: '#333' }}>{valor}</span>
                  </div>
                ))}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888', fontWeight: '600' }}>Descripción</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{solicitud.descripcion}</p>
                </div>
              </div>

              {/* Card resolución (editable) */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                  Resolución
                </h3>

                {/* Estado */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={e => setEstado(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1px solid #ddd', fontSize: '14px', outline: 'none',
                      color: '#333', backgroundColor: 'white', appearance: 'auto',
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="respondida">Respondida</option>
                  </select>
                </div>

                {/* Respuesta */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Respuesta
                  </label>
                  <textarea
                    rows={6}
                    value={respuesta}
                    onChange={e => setRespuesta(e.target.value)}
                    placeholder="Escribe la respuesta oficial para el ciudadano..."
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1px solid #ddd', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box', color: '#333', resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  onClick={handleGuardar}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '14px', backgroundColor: '#15305b', color: 'white',
                    border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar y Notificar'}
                </button>
              </div>

            </div>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Solicitud actualizada correctamente"
          duration={1500}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminGestionDetalle;