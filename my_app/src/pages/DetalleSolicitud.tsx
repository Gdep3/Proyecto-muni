import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonCard, IonCardContent, IonBadge, IonIcon, IonTextarea, IonSpinner, IonToast
} from '@ionic/react';
import {
  personCircleOutline, calendarOutline, documentTextOutline, sendOutline,
  attachOutline, documentAttachOutline, arrowBackOutline, checkmarkCircleOutline
} from 'ionicons/icons';
import { useParams, useHistory, useLocation } from 'react-router-dom';

interface SolicitudReal {
  id: number;
  folio: string;
  ciudadano: string; 
  fecha: string;
  asunto: string;
  descripcion: string;
  estado: 'pendiente' | 'respondida' | 'expirada';
  respuesta: string | null;
}

const DetalleSolicitud: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();

  // 1. Detectamos si es Admin o Ciudadano basándonos en la ruta
  const esAdmin = location.pathname.includes('/admin');
  const rutaVolver = esAdmin ? '/admin/gestion' : '/app/solicitudes';

  const [solicitud, setSolicitud] = useState<SolicitudReal | null>(null);
  const [cargando, setCargando] = useState(true);

  // Estados de UI para la respuesta
  const [respuestaInput, setRespuestaInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastMsj, setToastMsj] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Cargamos los datos REALES desde la Base de Datos
  useEffect(() => {
    const fetchSolicitud = async () => {
      setCargando(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/solicitudes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSolicitud({
            id: data.id,
            folio: data.folio,
            ciudadano: data.usuario_id, // Usamos el RUT que nos entrega el backend
            fecha: new Date(data.created_at).toLocaleDateString('es-CL'),
            asunto: data.asunto,
            descripcion: data.descripcion,
            estado: data.estado,
            respuesta: data.respuesta
          });
        } else {
          setToastMsj('Error al cargar la solicitud');
          setToastColor('danger');
          setMostrarToast(true);
        }
      } catch (error) {
        console.error("Error al obtener la solicitud:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  const obtenerBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <IonBadge style={{ '--background': '#ffc107', color: '#15305b', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold' }}>PENDIENTE</IonBadge>;
      case 'respondida':
        return <IonBadge style={{ '--background': '#28a745', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold' }}>RESPONDIDA</IonBadge>;
      default:
        return null;
    }
  };

  const handleAdjuntar = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleArchivoSeleccionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setNombreArchivo(file.name);
  };

  // 3. Función del Admin para mandar la respuesta real al backend
  const handleEnviarRespuesta = async () => {
    if (!respuestaInput.trim()) {
      setToastMsj('La respuesta oficial no puede estar vacía.');
      setToastColor('danger');
      setMostrarToast(true);
      return;
    }

    setEnviando(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      // Usamos el endpoint PUT que definimos en solicitudes.py
      const response = await fetch(`http://localhost:8000/solicitudes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: 'respondida',
          respuesta: respuestaInput
        })
      });

      if (response.ok) {
        setToastMsj('¡Respuesta oficial enviada al ciudadano!');
        setToastColor('success');
        setMostrarToast(true);
        setTimeout(() => history.push(rutaVolver), 2000);
      } else {
        throw new Error('Error al enviar la respuesta');
      }
    } catch (error) {
      setToastMsj('Ocurrió un error al enviar la respuesta.');
      setToastColor('danger');
      setMostrarToast(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white', paddingTop: '8px', paddingBottom: '8px' }}>
          <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', gap: '4px' }}>
            <IonButton style={{ color: 'white', '--padding-start': '0', '--padding-end': '8px' }} onClick={() => history.push(rutaVolver)}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} style={{ fontSize: '24px' }} />
            </IonButton>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/SantoDomingoIcono.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>Municipalidad de</span>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>Santo Domingo</span>
              </div>
            </div>
          </IonButtons>
          <IonTitle style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', fontSize: '16px' }}>
            Detalle Solicitud
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        {cargando || !solicitud ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <IonSpinner name="crescent" style={{ color: '#1a9cd8' }} />
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>

            {/* Tarjeta 1: Datos Generales */}
            <IonCard style={{ borderRadius: '16px', margin: '10px 0 20px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonIcon icon={documentTextOutline} style={{ color: '#15305b', fontSize: '24px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#15305b' }}>{solicitud.folio}</span>
                </div>
                {obtenerBadgeEstado(solicitud.estado)}
              </div>

              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <IonIcon icon={personCircleOutline} style={{ fontSize: '20px', color: '#666', marginTop: '2px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>RUT Solicitante</span>
                      <span style={{ color: '#333', fontWeight: '500' }}>{solicitud.ciudadano}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '20px', color: '#666', marginTop: '2px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Fecha de Ingreso</span>
                      <span style={{ color: '#333', fontWeight: '500' }}>{solicitud.fecha}</span>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Tarjeta 2: Requerimiento Original */}
            <IonCard style={{ borderRadius: '16px', margin: '0 0 20px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <IonCardContent style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#15305b', fontWeight: 'bold', fontSize: '16px' }}>
                  Asunto: {solicitud.asunto}
                </h3>
                <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #1a9cd8', marginTop: '16px' }}>
                  <p style={{ margin: 0, color: '#444', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {solicitud.descripcion}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Tarjeta 3: Respuesta Oficial (Si ya fue respondida, visible para AMBOS) */}
            {solicitud.estado === 'respondida' && solicitud.respuesta && (
              <IonCard style={{ borderRadius: '16px', margin: '0 0 20px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #28a745' }}>
                <IonCardContent style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#28a745', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '20px' }} />
                    Respuesta Oficial de la Municipalidad
                  </h3>
                  <div style={{ backgroundColor: '#f8fff9', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#333', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {solicitud.respuesta}
                    </p>
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            {/* Tarjeta 4: Redactar Respuesta (SOLO visible para ADMIN si está pendiente) */}
            {esAdmin && solicitud.estado === 'pendiente' && (
              <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #1a9cd8', boxShadow: 'none' }}>
                <IonCardContent style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#15305b', fontWeight: 'bold', fontSize: '16px' }}>
                    Redactar Respuesta Oficial
                  </h3>

                  <IonTextarea
                    placeholder="Escriba la respuesta oficial para el ciudadano aquí..."
                    rows={6}
                    value={respuestaInput}
                    onIonInput={e => setRespuestaInput(e.detail.value!)}
                    style={{ backgroundColor: '#fff', border: '1px solid #d5d5d5', borderRadius: '12px', padding: '12px', color: '#333' }}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleArchivoSeleccionado}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <IonButton
                      fill="outline"
                      onClick={handleAdjuntar}
                      style={{ '--color': nombreArchivo ? '#1a9cd8' : '#15305b', '--border-color': nombreArchivo ? '#1a9cd8' : '#d5d5d5', '--border-radius': '10px', textTransform: 'none' }}
                    >
                      <IonIcon icon={nombreArchivo ? documentAttachOutline : attachOutline} slot="start" />
                      {nombreArchivo ? nombreArchivo : 'Adjuntar Documentos'}
                    </IonButton>

                    <IonButton
                      onClick={handleEnviarRespuesta}
                      disabled={enviando}
                      style={{ '--background': '#28a745', '--color': 'white', '--border-radius': '10px', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      {enviando ? <IonSpinner name="crescent" /> : <><IonIcon icon={sendOutline} slot="start" /> Enviar Respuesta</>}
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            )}
          </div>
        )}

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={toastMsj}
          duration={3000}
          color={toastColor}
          position="bottom"
          style={{ fontWeight: 'bold', textAlign: 'center' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleSolicitud;