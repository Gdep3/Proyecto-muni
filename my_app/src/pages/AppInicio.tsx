import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon,
} from '@ionic/react';
import {
  personOutline, documentTextOutline, cloudDownloadOutline,
  shareOutline, arrowForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

const AppInicio: React.FC = () => {
  const history = useHistory();

  const accesos = [
    {
      titulo: 'Historial de Solicitudes',
      desc: 'Revisa el estado de las solicitudes de información que has enviado a la municipalidad.',
      ruta: '/app/solicitudes',
      label: 'Ver mis solicitudes',
      icon: documentTextOutline,
      color: '#15305b',
    },
    {
      titulo: 'Exportar Datos Abiertos',
      desc: 'Descarga información financiera automatizada en formatos CSV, JSON y XML.',
      ruta: '/inicio',
      label: 'Ir al catálogo',
      icon: cloudDownloadOutline,
      color: '#1a9cd8',
    },
  ];

  return (
    <IonPage>
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '28px 30px 110px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>
              ¡Hola! Bienvenido a tu panel
            </h2>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '13px', maxWidth: '420px' }}>
              Accede a la información financiera del municipio y gestiona tus solicitudes de transparencia.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            
            <IonButton
              color="light"
              onClick={() => history.push('/app/perfil')}   // <-- cambia esto
              style={{
                width: '48px', height: '48px', '--border-radius': '50%',
                '--padding-start': '0', '--padding-end': '0',
              }}
            >
              <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          </div>
        </div>

        {/* ── ACCESOS ── */}
        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {accesos.map((a) => (
            <div key={a.titulo} style={{
              flex: '1 1 280px', backgroundColor: 'white', borderRadius: '16px',
              padding: '28px 24px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                backgroundColor: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IonIcon icon={a.icon} style={{ color: a.color, fontSize: '24px' }} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                {a.titulo}
              </h3>
              <p style={{ margin: '0 0 24px', color: '#777', fontSize: '13px', lineHeight: '1.6' }}>
                {a.desc}
              </p>
              <IonButton
                expand="block"
                onClick={() => history.push(a.ruta)}
                style={{
                  '--background': a.color, '--border-radius': '12px',
                  '--box-shadow': 'none', fontWeight: '600',
                }}
              >
                {a.label}
                <IonIcon slot="end" icon={arrowForwardOutline} />
              </IonButton>
            </div>
          ))}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default AppInicio;