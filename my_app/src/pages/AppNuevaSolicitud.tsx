import React, { useState, useEffect } from 'react';
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
  informationCircleOutline,
  personCircleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const AppNuevaSolicitud: React.FC = () => {
  const history = useHistory();

  // 1. Estados para los datos del Usuario (Autocompletados)
  const [usuarioData, setUsuarioData] = useState({
    nombre: '',
    rut: '',
    email: ''
  });

  // 2. Estados para el Requerimiento (Lo que el usuario escribe)
  const [categoria, setCategoria] = useState('');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // 3. Estados de la Interfaz
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [toastMsj, setToastMsj] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // ✨ Efecto para cargar los datos del usuario logueado apenas entra a la página
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsuarioData({
            nombre: data.nombre,
            rut: data.rut,
            email: data.email
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario");
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleEnviarSolicitud = async () => {
    // 1. Validación de campos vacíos
    if (!categoria || !asunto || !descripcion) {
      setToastMsj('Por favor, completa todos los campos del requerimiento.');
      setToastColor('danger');
      setMostrarToast(true);
      return;
    }

    setEnviando(true);

    try {
      // 2. Buscamos el token con cualquiera de los nombres clásicos
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
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

      // 3. Si el servidor responde con error (Ej: 500 o 401), lo atrapamos
      if (!response.ok) {
        const detalleError = await response.json();
        console.error("Detalle del error desde el servidor:", detalleError);
        throw new Error('Error al enviar la solicitud');
      }

      // 4. Éxito absoluto
      setToastMsj('¡Solicitud ingresada exitosamente! Se ha generado tu folio.');
      setToastColor('success');
      setMostrarToast(true);

      setTimeout(() => {
        history.push('/app/inicio');
      }, 2000);

    } catch (error) {
      console.error("Falla general:", error);
      setToastMsj('Ocurrió un error. Presiona F12 y revisa la consola para más detalles.');
      setToastColor('danger');
      setMostrarToast(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white', paddingTop: '8px', paddingBottom: '8px' }}>
          <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', gap: '4px' }}>
            <IonButton style={{ color: 'white', '--padding-start': '0', '--padding-end': '8px' }} onClick={() => history.goBack()}>
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
            Ley de Transparencia
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        {cargandoDatos ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <IonSpinner name="crescent" style={{ color: '#1a9cd8' }} />
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '10px' }}>
            
            <h3 style={{ marginLeft: '4px', color: '#15305b', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
              1. Identificación del Solicitante
            </h3>
            <IonCard style={{ borderRadius: '16px', margin: '0 0 24px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '32px', color: '#1a9cd8' }} />
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                    Tus datos han sido cargados automáticamente desde tu perfil oficial.
                  </p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Nombre Completo</span>
                    <IonItem lines="none" style={{ '--background': '#f0f4f8', borderRadius: '8px', '--min-height': '40px' }}>
                      <IonInput readonly value={usuarioData.nombre} style={{ color: '#333', fontWeight: '500' }} />
                    </IonItem>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>RUT</span>
                    <IonItem lines="none" style={{ '--background': '#f0f4f8', borderRadius: '8px', '--min-height': '40px' }}>
                      <IonInput readonly value={usuarioData.rut} style={{ color: '#333', fontWeight: '500' }} />
                    </IonItem>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Correo Electrónico</span>
                    <IonItem lines="none" style={{ '--background': '#f0f4f8', borderRadius: '8px', '--min-height': '40px' }}>
                      <IonInput readonly value={usuarioData.email} style={{ color: '#333', fontWeight: '500' }} />
                    </IonItem>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <h3 style={{ marginLeft: '4px', color: '#15305b', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
              2. Detalle de la Solicitud
            </h3>
            <IonCard style={{ borderRadius: '16px', margin: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <IonCardContent style={{ padding: '24px' }}>
                
                <div style={{ marginBottom: '20px' }}>
                  <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Categoría de la Información <span style={{ color: 'red' }}>*</span></IonLabel>
                  <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px' }}>
                    <IonSelect placeholder="Seleccione un área" value={categoria} onIonChange={e => setCategoria(e.detail.value)} style={{ width: '100%', color: '#333' }}>
                      <IonSelectOption value="Finanzas y Presupuesto">Finanzas y Presupuesto</IonSelectOption>
                      <IonSelectOption value="Obras Municipales">Obras Municipales</IonSelectOption>
                      <IonSelectOption value="Salud Pública">Salud Pública</IonSelectOption>
                      <IonSelectOption value="Educación">Educación</IonSelectOption>
                      <IonSelectOption value="Tránsito">Tránsito y Transporte</IonSelectOption>
                      <IonSelectOption value="Otra">Otra Categoría</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Asunto Breve <span style={{ color: 'red' }}>*</span></IonLabel>
                  <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px' }}>
                    <IonInput placeholder="Ej: Copia de licitación" value={asunto} onIonInput={e => setAsunto(e.detail.value!)} style={{ color: '#333' }} />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <IonLabel style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Descripción de la Solicitud <span style={{ color: 'red' }}>*</span></IonLabel>
                  <IonItem lines="none" style={{ '--background': '#f8f9fa', border: '1px solid #d5d5d5', borderRadius: '10px' }}>
                    <IonTextarea rows={5} placeholder="Redacte la información que necesita..." value={descripcion} onIonInput={e => setDescripcion(e.detail.value!)} style={{ color: '#333', marginTop: '8px' }} />
                  </IonItem>
                </div>

                <IonButton expand="block" onClick={handleEnviarSolicitud} disabled={enviando} style={{ '--background': '#1a9cd8', '--border-radius': '12px', height: '50px', fontWeight: 'bold' }}>
                  {enviando ? <IonSpinner name="crescent" style={{ color: 'white' }} /> : (
                    <><IonIcon icon={sendOutline} slot="start" /> Enviar Solicitud Formal</>
                  )}
                </IonButton>

              </IonCardContent>
            </IonCard>
          </div>
        )}

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={toastMsj}
          duration={3000}
          color={toastColor}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default AppNuevaSolicitud;