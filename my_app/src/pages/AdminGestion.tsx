import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonSpinner,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard
} from '@ionic/react';
import { documentTextOutline, chevronForwardOutline, timeOutline, checkmarkCircleOutline, alertCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';


interface Solicitud {
  id: number;
  folio: string;
  ciudadano: string;
  fecha: string;
  extracto: string;
  estado: 'pendiente' | 'respondida' | 'expirada';
}

const AdminGestion: React.FC = () => {
  const history = useHistory();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  // ── DATOS SINTÉTICOS DE SOLICITUDES PARA PRUEBAS ──
  useEffect(() => {
    setCargando(true);
    setTimeout(() => {
      setSolicitudes([
        { id: 1, folio: 'TRA-2026-001', ciudadano: 'Juan Pérez Silva', fecha: '08/06/2026', extracto: 'Solicita copia de los gastos en luminarias públicas del sector norte.', estado: 'pendiente' },
        { id: 2, folio: 'TRA-2026-002', ciudadano: 'María Angélica Soto', fecha: '02/06/2026', extracto: 'Solicitud de actas de la comisión de salud sobre planes comunales.', estado: 'respondida' },
        { id: 3, folio: 'TRA-2026-003', ciudadano: 'Carlos Muñoz Rojas', fecha: '15/05/2026', extracto: 'Pide información sobre decretos de licitación de recolección de residuos.', estado: 'pendiente' },
        { id: 4, folio: 'TRA-2026-004', ciudadano: 'Patricia Vergara M.', fecha: '10/04/2026', extracto: 'Solicita organigrama de sueldos del personal de la dirección de obras.', estado: 'expirada' },
      ]);
      setCargando(false);
    }, 600);
  }, []);

  // Configuración de colores y etiquetas según el estado de la solicitud chilenas
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

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white', paddingTop: '8px', paddingBottom: '8px' }}>
          
          <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', gap: '4px' }}>
            
            {/* ESTE ES EL NUEVO BOTÓN QUE NO FALLA */}
            <IonButton 
              style={{ color: 'white', '--padding-start': '0', '--padding-end': '8px' }} 
              onClick={() => history.push('/admin/dashboard')}
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
            position: 'absolute', 
            left: '50%', 
            top: '50%',
            transform: 'translate(-50%, -50%)', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            width: 'auto',
            zIndex: 10,
            padding: 0,
            margin: 0
          }}>
            Gestión de Solicitudes
          </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
      
        <div style={{ padding: '10px 0 20px 0' }}>
          <h2 style={{ color: '#15305b', fontWeight: 'bold', margin: '0', fontSize: '22px' }}>
            Bandeja de Transparencia
          </h2>
          <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
            Revisa, fiscaliza y responde los requerimientos ingresados por la comunidad.
          </p>
        </div>

        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <IonSpinner name="crescent" style={{ color: '#1a9cd8' }} />
          </div>
        ) : (
          <IonGrid style={{ padding: 0 }}>
            <IonRow>
              <IonCol size="12">
                <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                  <IonList lines="full" style={{ padding: 0 }}>
                    {solicitudes.length === 0 ? (
                      <IonItem lines="none">
                        <IonLabel className="ion-text-center" style={{ padding: '40px 0', color: '#888' }}>
                          No hay solicitudes ingresadas en el sistema.
                        </IonLabel>
                      </IonItem>
                    ) : (
                      solicitudes.map((sol) => (
                        <IonItem 
                          key={sol.id} 
                          button 
                          detail={false}
                          onClick={() => history.push(`/admin/solicitud/${sol.id}`)}
                          style={{ '--padding-start': '20px', '--padding-end': '16px', '--min-height': '85px' }}
                        >
                          {/* Ícono de documento oficial */}
                          <IonIcon 
                            icon={documentTextOutline} 
                            slot="start" 
                            style={{ color: '#15305b', fontSize: '24px', backgroundColor: '#f0f4f8', padding: '10px', borderRadius: '12px', marginRight: '16px' }} 
                          />
                          
                          <IonLabel style={{ whiteSpace: 'normal' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 'bold', color: '#15305b', fontSize: '15px' }}>{sol.folio}</span>
                              <span style={{ color: '#888', fontSize: '12px' }}>• {sol.fecha}</span>
                            </div>
                            <h3 style={{ fontWeight: '600', color: '#333', margin: '0 0 4px 0', fontSize: '14px' }}>
                              De: {sol.ciudadano}
                            </h3>
                            <p style={{ color: '#666', fontSize: '13px', margin: '0', lineHeight: '1.3' }}>
                              {sol.extracto}
                            </p>
                          </IonLabel>

                          {/* Estado al extremo derecho */}
                          <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {obtenerBadgeEstado(sol.estado)}
                            <IonIcon icon={chevronForwardOutline} style={{ color: '#ccc', fontSize: '18px' }} />
                          </div>
                        </IonItem>
                      ))
                    )}
                  </IonList>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

      </IonContent>
    </IonPage>
  );
};

export default AdminGestion;