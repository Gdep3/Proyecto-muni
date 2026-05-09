import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid,
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
  IonCardContent,
  IonPopover,
} from '@ionic/react';
import {
  downloadOutline,
  expandOutline,
  personOutline,
  calendarOutline,
  cloudUploadOutline,
  reorderThreeOutline,
  informationCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useHistory } from 'react-router-dom';
 
/* ─── Datos ─────────────────────────────────────────────────────── */
const barDataBase = [
  { mes: 'Enero',      año1: 100000, año2: 0 },
  { mes: 'Febrero',    año1: 200000, año2: 0 },
  { mes: 'Marzo',      año1: 300000, año2: 0 },
  { mes: 'Abril',      año1: 100000, año2: 0 },
  { mes: 'Junio',      año1: 0,      año2: 0 },
  { mes: 'Julio',      año1: 0,      año2: 0 },
  { mes: 'Agosto',     año1: 0,      año2: 0 },
  { mes: 'Septiembre', año1: 0,      año2: 0 },
  { mes: 'Octubre',    año1: 0,      año2: 0 },
  { mes: 'Noviembre',  año1: 0,      año2: 0 },
];
 
const barDataComparado = [
  { mes: 'Enero',      año1: 100000, año2: 200000 },
  { mes: 'Febrero',    año1: 200000, año2: 460000 },
  { mes: 'Marzo',      año1: 300000, año2: 650000 },
  { mes: 'Abril',      año1: 100000, año2: 80000  },
  { mes: 'Junio',      año1: 520000, año2: 0      },
  { mes: 'Julio',      año1: 310000, año2: 0      },
  { mes: 'Agosto',     año1: 400000, año2: 0      },
  { mes: 'Septiembre', año1: 460000, año2: 0      },
  { mes: 'Octubre',    año1: 800000, año2: 0      },
  { mes: 'Noviembre',  año1: 100000, año2: 0      },
];
 
const pieData = [
  { name: 'Sin gastar', value: 42.9 },
  { name: 'Becas',      value: 28.6 },
  { name: 'Algo',       value: 14.3 },
  { name: 'Salud',      value: 14.3 },
];
const PIE_COLORS = ['#2a6095', '#1a9cd8', '#4ab8e8', '#3d7abf'];
 
const archivos = Array.from({ length: 6 }, (_, i) => `Archivo ${i + 1}`);
 
const renderPieLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
    {pieData.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#444' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[i] }} />
        {entry.name}
      </div>
    ))}
  </div>
);
 
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#444" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      <tspan x={x} dy="-0.4em" fontWeight="bold">{name}</tspan>
      <tspan x={x} dy="1.2em">{value}%</tspan>
    </text>
  );
};
interface InicioPublicoProps {
  userRole?: 'ciudadano' | 'admin' | null;
}
 
/* ─── Componente principal ──────────────────────────────────────── */
const InicioPublico: React.FC<InicioPublicoProps> = ({ userRole }) => {
  const history = useHistory();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [compareYear, setCompareYear]   = useState('Comparar');
  const [selectedArea, setSelectedArea] = useState('Salud');
  const [popoverOpen, setPopoverOpen]   = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
 
  const comparando       = compareYear !== 'Comparar';
  const barData          = comparando ? barDataComparado : barDataBase;
  const tituloGrafico    = comparando ? `${selectedArea} ${selectedYear} vs ${compareYear}` : selectedArea;
 
  const selectStyle: React.CSSProperties & Record<string, any> = {
    backgroundColor: 'white',
    color: '#15305b',
    borderRadius: '20px',
    padding: '1px 20px',
    minWidth: '130px',
    fontWeight: '600',
    fontSize: '14px',
    border: 'none',
    '--highlight-color-focused': 'transparent',
    '--border-color': 'transparent',
  };
 
  const abrirMenu = (e: React.MouseEvent) => {
    e.persist();
    setPopoverEvent(e);
    setPopoverOpen(true);
  };
 
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': '#ffffff' }}>
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
 
        {/* ── SECCIÓN AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '24px 30px 110px 30px', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { label: 'Año',          value: selectedYear, setter: setSelectedYear, options: [['2025','2025'],['2026','2026']],                                         minWidth: '110px' },
              { label: 'Comparar con', value: compareYear,  setter: setCompareYear,  options: [['Comparar','Comparar'],['2025','2025'],['2026','2026']],                  minWidth: '150px' },
              { label: 'Area',         value: selectedArea, setter: setSelectedArea, options: [['Total','Total'],['Salud','Salud'],['Compras','Compras Bienes y Servicios']], minWidth: '140px' },
            ].map(({ label, value, setter, options, minWidth }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                <IonSelect value={value} onIonChange={e => setter(e.detail.value)} interface="popover" style={{ ...selectStyle, minWidth }}>
                  {options.map(([val, txt]) => <IonSelectOption key={val} value={val}>{txt}</IonSelectOption>)}
                </IonSelect>
              </div>
            ))}
          </div>
         <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          {/* Botón subir archivo — solo visible para admin */}
          {userRole === 'admin' && (
            <IonButton
              color="light"
              style={{ width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0' }}
            >
              <IonIcon icon={cloudUploadOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          )}

          {/* Botón usuario */}
          <IonButton
            routerLink="/login"
            color="light"
            style={{ width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0' }}
          >
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>
        </div>
 
        {/* ── CONTENIDO ── */}
        <IonGrid style={{ marginTop: '-80px', padding: '0 20px 30px 20px' }}>
 
          <IonRow>
            {/* Barras */}
            <IonCol size="12" sizeMd="7">
              <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', margin: '0', height: '100%' }}>
                <IonCardContent style={{ height: '420px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '16px', flex: 1, textAlign: 'center' }}>
                      {tituloGrafico}
                    </h2>
                    <IonIcon icon={expandOutline} style={{ cursor: 'pointer', color: '#999', fontSize: '20px', flexShrink: 0 }}
                      onClick={() => history.push('/grafico-ampliado')} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barSize={comparando ? 14 : 20}>
                        <CartesianGrid vertical={false} stroke="#e8e8e8" />
                        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => v === 0 ? '0' : `${v / 1000}K`} />
                        <Tooltip formatter={(v) => typeof v === 'number' ? v.toLocaleString('es-CL') : v} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                          formatter={(value) => value === 'año1' ? `Año ${selectedYear}` : `Año ${compareYear}`} />
                        <Bar dataKey="año1" name="año1" fill="#1a9cd8" radius={[4, 4, 0, 0]} />
                        {comparando && <Bar dataKey="año2" name="año2" fill="#3d5fad" radius={[4, 4, 0, 0]} />}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
 
            {/* Pie */}
            <IonCol size="12" sizeMd="5">
              <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', margin: '0', height: '100%' }}>
                <IonCardContent style={{ height: '420px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                    <IonIcon icon={expandOutline} style={{ cursor: 'pointer', color: '#999', fontSize: '20px' }} />
                  </div>
                  {renderPieLegend()}
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius="65%"
                          dataKey="value" labelLine={true} label={renderCustomLabel}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => typeof v === 'number' ? `${v}%` : v} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
 
          {/* ── BÚSQUEDA Y ACCIONES ── */}
          <IonRow className="ion-align-items-center" style={{ marginTop: '28px', marginBottom: '12px' }}>
            <IonCol size="12" sizeMd="5">
              <IonSearchbar placeholder="Buscar Archivo" style={{
                padding: 0, '--border-radius': '30px', '--box-shadow': 'none',
                '--background': 'white', border: '1px solid #d5d5d5', borderRadius: '30px',
              }} />
            </IonCol>
            <IonCol size="auto" style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
              <IonButton fill="outline" shape="round" style={{
                '--background': 'white', '--color': '#333', '--box-shadow': 'none',
                '--border-radius': '20px', '--border-color': '#d5d5d5', '--border-width': '1px', height: '42px',
              }}>
                Mes <IonIcon slot="end" icon={calendarOutline} style={{ color: '#555' }} />
              </IonButton>
              <IonButton fill="outline" shape="round" style={{
                '--background': 'white', '--border-color': '#d5d5d5', '--border-width': '1px',
                '--padding-start': '0', '--padding-end': '0', width: '44px', height: '44px',
              }}>
                <IonIcon slot="icon-only" icon={downloadOutline} style={{ color: '#555' }} />
              </IonButton>
              <IonButton onClick={() => history.push('/lista-ampliada')} fill="outline" shape="round" style={{
                '--background': 'white', '--border-color': '#d5d5d5', '--border-width': '1px',
                '--padding-start': '0', '--padding-end': '0', width: '44px', height: '44px',
              }}>
                <IonIcon slot="icon-only" icon={expandOutline} style={{ color: '#555' }} />
              </IonButton>
              
            </IonCol>
          </IonRow>
 
          {/* ── LISTA ── */}
          <IonRow>
            <IonCol size="12">
              <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                <IonList lines="full" style={{ padding: 0 }}>
                  {archivos.map((archivo, index) => (
                    <IonItem key={index} button detail={false} style={{
                      '--padding-start': '24px', '--padding-end': '16px',
                      '--min-height': '58px', '--border-color': '#ebebeb',
                    }}>
                      <IonLabel style={{ fontWeight: '500', color: '#2a2a2a', fontSize: '15px' }}>
                        {archivo}
                      </IonLabel>
                      <IonIcon
                        slot="end"
                        icon={reorderThreeOutline}
                        style={{ color: '#aaa', fontSize: '22px', cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); abrirMenu(e as any); }}
                      />
                    </IonItem>
                  ))}
                </IonList>
              </IonCard>
            </IonCol>
          </IonRow>
 
        </IonGrid>
 
        {/* ── MENÚ CONTEXTUAL ── */}
        <IonPopover
          isOpen={popoverOpen}
          event={popoverEvent}
          onDidDismiss={() => setPopoverOpen(false)}
          showBackdrop={false}
          style={{ '--width': '220px', '--border-radius': '14px', '--box-shadow': '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <IonList lines="full" style={{ padding: '4px 0' }}>
            <IonItem button detail={false} onClick={() => setPopoverOpen(false)}
              style={{ '--padding-start': '16px', '--min-height': '52px' }}>
              <IonIcon icon={downloadOutline} style={{ color: '#333', marginRight: '12px', fontSize: '18px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222', fontSize: '14px' }}>Descargar</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} style={{ color: '#ccc', fontSize: '16px' }} />
            </IonItem>
            <IonItem button detail={false}
              onClick={() => { setPopoverOpen(false); history.push('/detalle-archivo'); }}
              style={{ '--padding-start': '16px', '--min-height': '52px', '--border-color': 'transparent' }}>
              <IonIcon icon={informationCircleOutline} style={{ color: '#333', marginRight: '12px', fontSize: '18px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222', fontSize: '14px' }}>Ver Información</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} style={{ color: '#ccc', fontSize: '16px' }} />
            </IonItem>
          </IonList>
        </IonPopover>
 
      </IonContent>
    </IonPage>
  );
};
 
export default InicioPublico;