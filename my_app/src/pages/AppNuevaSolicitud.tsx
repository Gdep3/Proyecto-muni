import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonSpinner,
  IonItem,
  IonLabel
} from '@ionic/react';
import { 
  documentTextOutline, 
  sendOutline, 
  arrowBackOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const AppNuevaSolicitud: React.FC = () => {
  const history = useHistory();

  // Estados que coinciden exactamente con SolicitudCreate en schemas.py
  const [categoria, setCategoria] = useState('');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estados de la UI
  const [cargando, setCargando] = useState(false);
  const [toastMsj, setToastMsj] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const handleEnviarSolicitud = async () => {
    // 1. Validación básica
    if (!categoria || !asunto || !descripcion) {
      setToastMsj('Por favor, completa todos los campos requeridos.');
      setToastColor('danger');
      setMostrarToast(true);
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      
      // 2. Conexión real con el backend
      const response = await fetch('http://localhost:8000/solicitudes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoria,
          asunto,
          descripcion
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      // 3. Éxito
      setToastMsj('¡Solicitud ingresada exitosamente! Se ha generado tu folio.');
      setToastColor('success');
      setMostrarToast(true);

      // Limpiar formulario y devolver al usuario a la página de inicio tras 2 segundos
      setTimeout(() => {
        history.push('/app/inicio');
      }, 2000);

    } catch (error) {
      setToastMsj('Ocurrió un error de conexión con el servidor.');
      setToastColor('danger');
      setMostrarToast(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      {/* HEADER INSTITUCIONAL (Idéntico al Admin pero enfocado en el Ciudadano) */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white', paddingTop: '8px', paddingBottom: '8px' }}>
          
          <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', gap: '4px' }}>
            <IonButton 
              style={{ color: 'white', '--padding-start': '0', '--padding-end': '8px' }} 
              onClick={() => history.push('/app/inicio')}
            >
              <IonIcon slot="icon-only" icon={arrowBackOutline} style={{ fontSize: '24px' }} />
            </IonButton>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/SantoDomingoIcono.png" 
                alt="Logo" 
                style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                  Municipalidad de
                </span>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold', lineHeight: '1.1' }}>
                  Santo Domingo
                </span>
              </div>
            </div>
          </IonButtons>

          <IonTitle style={{ 
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', 
            fontWeight: 'bold', fontSize: '16px', width: 'auto', zIndex: 10, padding: 0, margin: 0 
          }}>
            Ley de Transparencia
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '10px' }}>
          
          {/* Tarjeta Informativa */}
          <IonCard style={{ borderRadius: '16px', margin: '0 0 20px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #1a9cd8' }}>
            <IonCardContent style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <IonIcon icon={informationCircleOutline} style={{ color: '#1a9cd8', fontSize: '28px', marginTop: '2px' }} />
              <div>
                <h3 style={{ margin: '0 0 6px 0', color: '#15305b', fontWeight: 'bold', fontSize: '15px' }}>
                  Ingreso de Nueva Solicitud
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
                  A través de este formulario usted puede ejercer su derecho de acceso a la información pública. Complete los detalles de forma clara para que el equipo municipal pueda procesar su requerimiento.
                </p>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Tarjeta del Formulario */}
          <IonCard style={{ borderRadius: '16px', margin: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <IonCardContent style={{ padding: '24px' }}>
              
              {/* Campo: Categoría */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Categoría de la Información <span style={{ color: 'red' }}>*</span>
                </IonLabel>
                <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px' }}>
                  <IonSelect 
                    placeholder="Seleccione un departamento o área" 
                    value={categoria} 
                    onIonChange={e => setCategoria(e.detail.value)}
                    style={{ width: '100%', color: '#333' }}
                    interface="action-sheet"
                  >
                    <IonSelectOption value="Finanzas y Presupuesto">Finanzas y Presupuesto</IonSelectOption>
                    <IonSelectOption value="Obras Municipales">Obras Municipales</IonSelectOption>
                    <IonSelectOption value="Salud">Salud Pública</IonSelectOption>
                    <IonSelectOption value="Educacion">Educación</IonSelectOption>
                    <IonSelectOption value="Transito">Tránsito y Transporte</IonSelectOption>
                    <IonSelectOption value="Otra">Otra Categoría</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </div>

              {/* Campo: Asunto */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Asunto Breve <span style={{ color: 'red' }}>*</span>
                </IonLabel>
                <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px' }}>
                  <IonInput 
                    placeholder="Ej: Copia de decreto de licitación luminarias" 
                    value={asunto}
                    onIonInput={e => setAsunto(e.detail.value!)}
                    style={{ '--padding-start': '0', color: '#333' }}
                  />
                </IonItem>
              </div>

              {/* Campo: Descripción Detallada */}
              <div style={{ marginBottom: '24px' }}>
                <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Descripción de la Solicitud <span style={{ color: 'red' }}>*</span>
                </IonLabel>
                <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px', alignItems: 'flex-start' }}>
                  <IonTextarea 
                    placeholder="Redacte aquí de la forma más clara posible la información, documento o estadística que necesita..." 
                    rows={6}
                    value={descripcion}
                    onIonInput={e => setDescripcion(e.detail.value!)}
                    style={{ '--padding-start': '0', color: '#333', marginTop: '8px' }}
                  />
                </IonItem>
              </div>

              {/* Botón de Envío */}
              <IonButton 
                expand="block" 
                onClick={handleEnviarSolicitud}
                disabled={cargando}
                style={{ 
                  '--background': '#1a9cd8', 
                  '--background-hover': '#1481b5',
                  '--border-radius': '12px', 
                  height: '50px', 
                  fontWeight: 'bold', 
                  fontSize: '16px',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(26,156,216,0.3)'
                }}
              >
                {cargando ? <IonSpinner name="crescent" style={{ color: 'white' }} /> : (
                  <>
                    <IonIcon icon={sendOutline} slot="start" />
                    Ingresar Solicitud Oficial
                  </>
                )}
              </IonButton>

            </IonCardContent>
          </IonCard>
        </div>

        {/* Notificación Flotante */}
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

export default AppNuevaSolicitud;