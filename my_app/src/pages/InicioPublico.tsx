import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonSpinner,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonPopover,
} from '@ionic/react';
import {
  downloadOutline,
  personOutline,
  calendarOutline,
  reorderThreeOutline,
  informationCircleOutline,
  documentTextOutline,
  libraryOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';

interface InicioPublicoProps {
  userRole?: 'ciudadano' | 'admin' | null;
  isAuth?: boolean;
}

const InicioPublico: React.FC<InicioPublicoProps> = ({ userRole, isAuth = false }) => {
  const history = useHistory();

  // Estados
  const [selectedYear, setSelectedYear] = useState('2026');
  const [compareYear, setCompareYear]   = useState('Comparar');
  const [selectedArea, setSelectedArea] = useState('Total');
  
  const [popoverOpen, setPopoverOpen]   = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  const [docSeleccionado, setDocSeleccionado] = useState<number | null>(null);
  
  const [documentos, setDocumentos]     = useState<any[]>([]);
  const [cargando, setCargando]         = useState(true);

  const años = ['2025', '2026'];
  const areas = ['Total', 'Salud', 'Educación', 'Obras Públicas'];

  // Datos Sintéticos para Gráficos
  const datosEvolucion = [
    { mes: 'Ene', presupuesto: 120, gastado: 100 },
    { mes: 'Feb', presupuesto: 150, gastado: 130 },
    { mes: 'Mar', presupuesto: 180, gastado: 165 },
    { mes: 'Abr', presupuesto: 140, gastado: 125 },
    { mes: 'May', presupuesto: 160, gastado: 155 },
    { mes: 'Jun', presupuesto: 190, gastado: 180 },
  ];

  const datosDistribucion = [
    { name: 'Salud', value: 35, color: '#15305b' },
    { name: 'Educación', value: 25, color: '#1a9cd8' },
    { name: 'Obras Públicas', value: 20, color: '#4ab8e8' },
    { name: 'Seguridad', value: 10, color: '#8ecae6' },
    { name: 'Social', value: 10, color: '#bde0fe' },
  ];

  // Función tres puntitos
  const abrirMenu = (e: React.MouseEvent, id: number) => {
    e.persist();
    setDocSeleccionado(id);
    setPopoverEvent(e);
    setPopoverOpen(true);
  };

  //Descarga
  const simularDescarga = (nombreArchivo: string) => {
    const contenido = "Este es un documento oficial de prueba de la Municipalidad de Santo Domingo.\n\nGenerado desde el nuevo portal web.";
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo.replace('.pdf', '.txt'); 
    enlace.click();
    window.URL.revokeObjectURL(url);
  };

  /*DOCUMENTOS*/
  useEffect(() => {
    setCargando(true);
    setTimeout(() => {
      setDocumentos([
        { id: 1, descripcion: 'Presupuesto Municipal Aprobado 2026.pdf', codigo: 'DOC-001' },
        { id: 2, descripcion: 'Acta de Concejo Municipal - Marzo 2026.pdf', codigo: 'DOC-002' },
        { id: 3, descripcion: 'Plan Regulador Comunal Actualizado.pdf', codigo: 'DOC-003' },
        { id: 4, descripcion: 'Informe de Gastos de Salud - Trimestre 1.pdf', codigo: 'DOC-004' }
      ]);
      setCargando(false);
    }, 600); 
  }, []);

  const selectStyle: React.CSSProperties = {
    backgroundColor: 'white', color: '#15305b', borderRadius: '20px', padding: '1px 20px',
    minWidth: '130px', fontWeight: '600', fontSize: '14px', border: 'none',
  };

  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── SECCIÓN AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '24px 30px 110px 30px', color: 'white',
          display: 'flex', flexDirection: 'column', gap: '20px', borderBottomRightRadius: '80px',
        }}>

          {/* Fila 1: Logo y Perfil */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/SantoDomingoIcono.png" alt="Logo Santo Domingo" style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2' }}>Municipalidad de</span>
                <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.1' }}>Santo Domingo</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {!isAuth && (
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '500', textAlign: 'right', lineHeight: '1.2' }}>
                  No has iniciado sesión <br/><span style={{ fontSize: '12px', color: '#4ab8e8' }}>Modo visitante</span>
                </span>
              )}
              
              <IonButton color="light"
                onClick={() => {
                  if (!isAuth) {
                    history.push('/login'); // Invitados van al login
                  } else if (userRole === 'admin') {
                    history.push('/admin/perfil'); // El administrador va a sus propios datos
                  } else {
                    history.push('/app/perfil'); // El ciudadano va a sus propios datos
                  }
                }}
                style={{ width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0' }}
              >
                <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
              </IonButton>
            </div>
          </div>

          {/* Fila 2: Botones Rápidos */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <IonButton 
              onClick={() => isAuth ? history.push('/app/nueva-solicitud') : history.push('/login')}
              style={{ '--background': 'rgba(255,255,255,0.1)', '--color': 'white', '--border-radius': '20px', '--border-color': 'rgba(255,255,255,0.3)', '--border-style': 'solid', '--border-width': '1px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: '500', textTransform: 'none' }}
            >
              <IonIcon icon={documentTextOutline} slot="start" style={{ fontSize: '16px' }}/>
              Solicitud de Transparencia
            </IonButton>

            <IonButton 
              onClick={() => history.push('/decretos')}
              style={{ '--background': 'rgba(255,255,255,0.1)', '--color': 'white', '--border-radius': '20px', '--border-color': 'rgba(255,255,255,0.3)', '--border-style': 'solid', '--border-width': '1px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: '500', textTransform: 'none' }}
            >
              <IonIcon icon={libraryOutline} slot="start" style={{ fontSize: '16px' }}/>
              Decretos
            </IonButton>

            {isAuth && userRole === 'admin' && (
              <IonButton 
                onClick={() => history.push('/admin/dashboard')}
                style={{ '--background': '#ffc107', '--color': '#15305b', '--border-radius': '20px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: 'bold', textTransform: 'none' }}
              >
                <IonIcon icon={shieldCheckmarkOutline} slot="start" style={{ fontSize: '16px' }}/>
                Volver al panel de administrador
              </IonButton>
            )}
          </div>

          {/* Fila 3: Filtros */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
                { label: 'Año', value: selectedYear, setter: setSelectedYear, options: años.map(a => [a, a]), minWidth: '110px' },
                { label: 'Comparar con', value: compareYear, setter: setCompareYear, options: [['Comparar','Comparar'], ...años.map(a => [a, a])], minWidth: '150px' },
                { label: 'Area', value: selectedArea, setter: setSelectedArea, options: areas.map(a => [a, a]), minWidth: '140px' },
            ].map(({ label, value, setter, options, minWidth }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                <IonSelect value={value} onIonChange={e => setter(e.detail.value)} interface="popover" style={{ ...selectStyle, minWidth }}>
                  {options.map(([val, txt]) => <IonSelectOption key={val} value={val}>{txt}</IonSelectOption>)}
                </IonSelect>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ── */}
        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <IonSpinner name="crescent" style={{ color: '#15305b' }} />
          </div>
        ) : (
        <IonGrid style={{ marginTop: '-80px', padding: '0 20px 30px 20px' }}>
          
          {/* Gráficos */}
          <IonRow>
            <IonCol size="12" sizeMd="7">
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: '400px' }}>
                <h3 style={{ color: '#15305b', fontWeight: 'bold', fontSize: '16px', margin: '0 0 20px 0' }}>Evolución del Presupuesto 2026</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosEvolucion} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} />
                    <Tooltip cursor={{ fill: '#f4f6f9' }} contentStyle={{ borderRadius: '10px', border: 'none' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="presupuesto" name="Asignado" fill="#1a9cd8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="gastado" name="Gastado" fill="#15305b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="5">
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#15305b', fontWeight: 'bold', fontSize: '16px', margin: '0 0 20px 0' }}>Distribución (%)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={datosDistribucion} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                      {datosDistribucion.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </IonCol>
          </IonRow>

          {/* Barra de Búsqueda de Archivos */}
          <IonRow className="ion-align-items-center" style={{ marginTop: '28px', marginBottom: '12px' }}>
            <IonCol size="12" sizeMd="5">
              <IonSearchbar placeholder="Buscar Archivo" style={{ padding: 0, '--border-radius': '30px', '--box-shadow': 'none', '--background': 'white', border: '1px solid #d5d5d5', borderRadius: '30px' }} />
            </IonCol>
            <IonCol size="auto" style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
              <IonButton fill="outline" shape="round" style={{ '--background': 'white', '--color': '#333', '--box-shadow': 'none', '--border-radius': '20px', '--border-color': '#d5d5d5', '--border-width': '1px', height: '42px' }}>
                Mes <IonIcon slot="end" icon={calendarOutline} style={{ color: '#555' }} />
              </IonButton>
              <IonButton fill="outline" shape="round" onClick={() => simularDescarga('Todos_Los_Documentos.zip')} style={{ '--background': 'white', '--border-color': '#d5d5d5', '--border-width': '1px', '--padding-start': '0', '--padding-end': '0', width: '44px', height: '44px' }}>
                <IonIcon slot="icon-only" icon={downloadOutline} style={{ color: '#555' }} />
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Lista de Documentos */}
          <IonRow>
            <IonCol size="12">
              <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <IonList lines="full" style={{ padding: 0 }}>
                  {documentos.length === 0 ? (
                    <IonItem><IonLabel style={{ color: '#888' }}>No hay documentos.</IonLabel></IonItem>
                  ) : (
                    documentos.map((doc) => (
                      <IonItem key={doc.id} button detail={false} style={{ '--padding-start': '24px', '--padding-end': '16px', '--min-height': '58px' }}>
                        <IonLabel style={{ fontWeight: '500', color: '#2a2a2a' }}>{doc.descripcion}</IonLabel>
                        <IonIcon slot="end" icon={reorderThreeOutline} style={{ color: '#aaa', fontSize: '22px', cursor: 'pointer' }} onClick={(e) => abrirMenu(e as any, doc.id)} />
                      </IonItem>
                    ))
                  )}
                </IonList>
              </IonCard>
            </IonCol>
          </IonRow>

        </IonGrid>
        )}

        {/* ── MENÚ CONTEXTUAL ── */}
        <IonPopover isOpen={popoverOpen} event={popoverEvent} onDidDismiss={() => setPopoverOpen(false)} showBackdrop={false} style={{ '--width': '220px', '--border-radius': '14px' }}>
          <IonList lines="full" style={{ padding: '4px 0' }}>
            <IonItem button detail={false} onClick={() => { 
                setPopoverOpen(false); 
                if (docSeleccionado) {
                  const doc = documentos.find(d => d.id === docSeleccionado);
                  if (doc) simularDescarga(doc.descripcion);
                }
              }} style={{ '--padding-start': '16px', '--min-height': '52px' }}>
              <IonIcon icon={downloadOutline} style={{ color: '#333', marginRight: '12px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222' }}>Descargar</IonLabel>
            </IonItem>
            <IonItem button detail={false} onClick={() => { setPopoverOpen(false); history.push(`/detalle-archivo/${docSeleccionado}`); }} style={{ '--padding-start': '16px', '--min-height': '52px' }}>
              <IonIcon icon={informationCircleOutline} style={{ color: '#333', marginRight: '12px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222' }}>Ver Información</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>

      </IonContent>
    </IonPage>
  );
};

export default InicioPublico;