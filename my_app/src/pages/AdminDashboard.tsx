import React, { useState } from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButton, IonIcon, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  peopleOutline, documentTextOutline, globeOutline, personOutline,
  cloudUploadOutline,
} from 'ionicons/icons';

const BASE_URL = 'http://localhost:8000';

const AdminDashboard: React.FC = () => {
  const history = useHistory();

  const [importando, setImportando]       = useState(false);
  const [toastMsg,   setToastMsg]         = useState('');
  const [toastColor, setToastColor]       = useState<'success' | 'danger'>('success');
  const [showToast,  setShowToast]        = useState(false);

  const mostrarToast = (msg: string, color: 'success' | 'danger') => {
    setToastMsg(msg);
    setToastColor(color);
    setShowToast(true);
  };

  const handleImportar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resetear el input para que se pueda subir el mismo archivo dos veces
    e.target.value = '';

    setImportando(true);
    try {
      const token = localStorage.getItem('token');

      // Importar documentos
      const formDoc = new FormData();
      formDoc.append('file', file);
      const resDoc = await fetch(`${BASE_URL}/documentos/importar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDoc,
      });
      const dataDoc = await resDoc.json();

      // Importar gastos (mismo archivo, segunda vez)
      const formGastos = new FormData();
      formGastos.append('file', file);
      const resGastos = await fetch(`${BASE_URL}/gastos/importar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formGastos,
      });
      const dataGastos = await resGastos.json();

      mostrarToast(
        `✓ Documentos: ${dataDoc.mensaje} | Gastos: ${dataGastos.mensaje}`,
        'success'
      );
    } catch (err) {
      mostrarToast('Error al importar el archivo. Verifica el formato CSV.', 'danger');
    } finally {
      setImportando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white' }}>
          <div slot="start" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '16px' }}>
            <img 
              src="/SantoDomingoIcono.png" 
              alt="Logo Santo Domingo" 
              style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                Municipalidad de
              </span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.1' }}>
                Santo Domingo
              </span>
            </div>
          </div>

          <IonTitle style={{ 
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontWeight: 'bold', fontSize: '16px', textAlign: 'center', padding: '0', width: 'auto',
          }}>
            Panel de Control
          </IonTitle>

          <IonButtons slot="end" style={{ marginRight: '8px' }}>
            <IonButton style={{ color: 'white' }} onClick={() => history.push('/admin/perfil')}>
              <IonIcon slot="icon-only" icon={personOutline} style={{ fontSize: '24px' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>

        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#15305b', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            Bienvenido al Centro de Control
          </h2>
          <p style={{ color: '#666', margin: '0' }}>
            Gestiona usuarios y solicitudes de la Municipalidad de Santo Domingo.
          </p>
        </div>

        <IonGrid style={{ maxWidth: '800px', margin: '0 auto' }}>
          <IonRow>

            {/* Tarjeta: Gestión de Usuarios */}
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/admin/usuarios')}
                style={{ borderRadius: '15px', height: '100%', margin: '10px 0' }}>
                <IonCardHeader>
                  <IonIcon icon={peopleOutline} style={{ fontSize: '45px', color: '#1a9cd8' }} />
                  <IonCardTitle style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>
                    Gestión de Usuarios
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ fontSize: '14px', color: '#555' }}>
                  Administra los roles, asciende a nuevos administradores y revisa las cuentas registradas en la plataforma.
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Tarjeta: Gestión de Solicitudes */}
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/admin/gestion')}
                style={{ borderRadius: '15px', height: '100%', margin: '10px 0' }}>
                <IonCardHeader>
                  <IonIcon icon={documentTextOutline} style={{ fontSize: '45px', color: '#1a9cd8' }} />
                  <IonCardTitle style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>
                    Trámites y Solicitudes
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ fontSize: '14px', color: '#555' }}>
                  Revisa, gestiona y responde las solicitudes de Ley de Transparencia enviadas por los ciudadanos.
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* ── BOTÓN IMPORTAR CSV ── */}
            <IonCol size="12">
              <input
                type="file"
                id="csv-import"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleImportar}
              />
              <IonCard style={{ borderRadius: '15px', margin: '10px 0', border: '2px dashed #1a9cd8', boxShadow: 'none', backgroundColor: '#f0f8ff' }}>
                <IonCardContent style={{ textAlign: 'center', padding: '24px' }}>
                  <IonIcon icon={cloudUploadOutline} style={{ fontSize: '48px', color: '#1a9cd8', display: 'block', marginBottom: '12px' }} />
                  <h3 style={{ margin: '0 0 6px', fontWeight: '700', color: '#15305b', fontSize: '16px' }}>
                    Importar datos desde CSV
                  </h3>
                  <p style={{ margin: '0 0 16px', color: '#666', fontSize: '13px' }}>
                    Sube un archivo CSV para actualizar automáticamente los documentos y gastos del portal público.
                  </p>
                  <IonButton
                    onClick={() => document.getElementById('csv-import')?.click()}
                    disabled={importando}
                    style={{
                      '--background': importando ? '#aaa' : '#1a9cd8',
                      '--border-radius': '12px',
                      '--box-shadow': 'none',
                      fontWeight: '600',
                    }}
                  >
                    <IonIcon slot="start" icon={cloudUploadOutline} />
                    {importando ? 'Importando...' : 'Seleccionar archivo CSV'}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Botón: Ir al Portal Público */}
            <IonCol size="12">
              <IonButton
                expand="block"
                onClick={() => history.push('/')}
                style={{
                  '--background': '#28a745', '--color': 'white',
                  '--border-radius': '12px', height: '60px',
                  marginTop: '10px', fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                <IonIcon slot="start" icon={globeOutline} style={{ fontSize: '24px' }} />
                Ir al Portal Público
              </IonButton>
            </IonCol>

          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={4000}
          color={toastColor}
          position="bottom"
        />

      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;