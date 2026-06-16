import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
  IonTextarea,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { 
  personCircleOutline, 
  calendarOutline, 
  mailOutline, 
  documentTextOutline, 
  sendOutline, 
  attachOutline,
  documentAttachOutline // ✨ Ícono para cuando hay un archivo
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';

interface Solicitud {
  id: number;
  folio: string;
  ciudadano: string;
  email: string;
  fecha: string;
  extracto: string;
  estado: 'pendiente' | 'respondida' | 'expirada';
  mensajeCompleto: string;
}

const DetalleSolicitud: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cargando, setCargando] = useState(true);
  
  const [mostrarToast, setMostrarToast] = useState(false);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulamos la búsqueda de la solicitud en la base de datos
  useEffect(() => {
    setCargando(true);
    setTimeout(() => {
      const bdSimulada: Solicitud[] = [
        { 
          id: 1, folio: 'TRA-2026-001', ciudadano: 'Juan Pérez Silva', email: 'juan.perez@correo.cl', fecha: '08/06/2026', estado: 'pendiente',
          extracto: 'Solicita copia de los gastos en luminarias públicas del sector norte.',
          mensajeCompleto: 'Junto con saludar, solicito mediante la Ley de Transparencia el detalle de los gastos incurridos en la instalación y mantención de luminarias públicas en el sector norte de la comuna, específicamente entre las calles Los Aromos y Las Araucarias, durante el periodo de enero a mayo de 2026. Agradecería que se adjunte el decreto de licitación correspondiente.'
        },
        { 
          id: 2, folio: 'TRA-2026-002', ciudadano: 'María Angélica Soto', email: 'msoto@mail.com', fecha: '02/06/2026', estado: 'respondida',
          extracto: 'Solicitud de actas de la comisión de salud sobre planes comunales.',
          mensajeCompleto: 'Estimados, requiero copia íntegra de las actas de las sesiones de la Comisión de Salud del Concejo Municipal realizadas durante el mes de marzo de 2026.'
        }
      ];

      const encontrada = bdSimulada.find(s => s.id === parseInt(id)) || bdSimulada[0];
      setSolicitud(encontrada);
      setCargando(false);
    }, 500);
  }, [id]);

  const obtenerBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <IonBadge style={{ '--background': '#ffc107', color: '#15305b', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold' }}>PENDIENTE</IonBadge>;
      case 'respondida':
        return <IonBadge style={{ '--background': '#28a745', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold' }}>RESPONDIDA</IonBadge>;
      case 'expirada':
        return <IonBadge style={{ '--background': '#dc3545', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold' }}>EXPIRADA</IonBadge>;
      default:
        return null;
    }
  };

  const handleAdjuntar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleArchivoSeleccionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNombreArchivo(file.name); 
    }
  };

  const handleEnviar = () => {
    setMostrarToast(true);
    
    setTimeout(() => {
      history.push('/admin/gestion');
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white', paddingTop: '8px', paddingBottom: '8px' }}>
          
          <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', gap: '4px' }}>
            <IonBackButton defaultHref="/admin/gestion" style={{ color: 'white' }} />
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
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Tarjeta 1: Datos */}
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
                      <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Solicitante</span>
                      <span style={{ color: '#333', fontWeight: '500' }}>{solicitud.ciudadano}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <IonIcon icon={mailOutline} style={{ fontSize: '20px', color: '#666', marginTop: '2px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Correo Electrónico</span>
                      <span style={{ color: '#333', fontWeight: '500' }}>{solicitud.email}</span>
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

            {/* Tarjeta 2: Mensaje */}
            <IonCard style={{ borderRadius: '16px', margin: '0 0 20px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <IonCardContent style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#15305b', fontWeight: 'bold', fontSize: '16px' }}>
                  Detalle del Requerimiento
                </h3>
                <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #1a9cd8' }}>
                  <p style={{ margin: 0, color: '#444', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {solicitud.mensajeCompleto}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Tarjeta 3: Redactar Respuesta */}
            {solicitud.estado === 'pendiente' && (
              <IonCard style={{ borderRadius: '16px', margin: '0 0 40px 0', border: '1px solid #1a9cd8', boxShadow: 'none' }}>
                <IonCardContent style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#15305b', fontWeight: 'bold', fontSize: '16px' }}>
                    Redactar Respuesta Oficial
                  </h3>
                  
                  <IonTextarea 
                    placeholder="Escriba la respuesta oficial para el ciudadano aquí..." 
                    rows={6}
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
                      onClick={handleEnviar}
                      style={{ '--background': '#28a745', '--color': 'white', '--border-radius': '10px', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      <IonIcon icon={sendOutline} slot="start" />
                      Enviar Respuesta
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
          message="¡Respuesta enviada exitosamente al ciudadano!"
          duration={2000}
          color="success"
          icon={sendOutline}
          position="bottom"
          style={{ fontWeight: 'bold', textAlign: 'center' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleSolicitud;