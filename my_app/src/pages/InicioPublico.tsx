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
  IonCardContent,
  IonPopover,
} from '@ionic/react';
import {
  downloadOutline,
  expandOutline,
  personOutline,
  calendarOutline,
  reorderThreeOutline,
  informationCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';
import { gastosService } from '../services/api';
import { documentosService } from '../services/api';

/* Constantes  */
const MESES = [
  { label: 'Enero', num: 1 }, { label: 'Febrero', num: 2 }, { label: 'Marzo', num: 3 },
  { label: 'Abril', num: 4 }, { label: 'Junio', num: 6 }, { label: 'Julio', num: 7 },
  { label: 'Agosto', num: 8 }, { label: 'Septiembre', num: 9 },
  { label: 'Octubre', num: 10 }, { label: 'Noviembre', num: 11 },
];

const PIE_COLORS = ['#2a6095', '#1a9cd8', '#4ab8e8', '#3d7abf'];

/* Helpers  */
const renderPieLegend = (pieData: any[]) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
    {pieData.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#444' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
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

/* Props  */
interface InicioPublicoProps {
  userRole?: 'ciudadano' | 'admin' | null;
  isAuth?: boolean;
}

/* Componente  */
const InicioPublico: React.FC<InicioPublicoProps> = ({ userRole, isAuth = false }) => {
  const history = useHistory();

  // Cambiamos los valores iniciales para que no rompan si la BD está en 2025 de forma predeterminada
  const [selectedYear, setSelectedYear] = useState('2025');
  const [compareYear, setCompareYear]   = useState('Comparar');
  const [selectedArea, setSelectedArea] = useState('Total');
  const [busqueda, setBusqueda]         = useState(''); // 🔍 Nuevo estado para la barra de búsqueda
  
  const [popoverOpen, setPopoverOpen]   = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  const [barData, setBarData]           = useState<any[]>([]);
  const [pieData, setPieData]           = useState<any[]>([]);
  const [documentos, setDocumentos]     = useState<any[]>([]);
  const [docSeleccionado, setDocSeleccionado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  const [años, setAños]   = useState<string[]>(['2025', '2026']);
  const [areas, setAreas] = useState<string[]>(['Total']);

  const [version, setVersion] = useState(0);

  const abrirMenu = (e: React.MouseEvent, id: number) => {
    e.persist();
    setDocSeleccionado(id);
    setPopoverEvent(e);
    setPopoverOpen(true);
  };

  const comparando    = compareYear !== 'Comparar';
  const tituloGrafico = comparando
    ? `${selectedArea} ${selectedYear} vs ${compareYear}`
    : selectedArea;

  /* ── Cargar barras ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const area = selectedArea === 'Total' ? undefined : selectedArea;
        const data1 = await gastosService.listar(Number(selectedYear), area);
        let data2: any[] = [];
        if (comparando) {
          data2 = await gastosService.listar(Number(compareYear), area);
        }
        const transformado = MESES.map(({ label, num }) => ({
          mes:  label,
          año1: data1.find((d: any) => d.mes === num)?.monto ?? 0,
          año2: data2.find((d: any) => d.mes === num)?.monto ?? 0,
        }));
        setBarData(transformado);
      } catch {
        setBarData(MESES.map(({ label }) => ({ mes: label, año1: 0, año2: 0 })));
      }
    };
    cargar();
  }, [selectedYear, compareYear, selectedArea, version]);

  /* Cargar pie  */
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await gastosService.listar(Number(selectedYear));
        const porArea: Record<string, number> = {};
        data.forEach((d: any) => {
          porArea[d.area] = (porArea[d.area] ?? 0) + d.monto;
        });
        const total = Object.values(porArea).reduce((a: number, b) => a + (b as number), 0);
        setPieData(
          Object.entries(porArea).map(([name, monto]) => ({
            name,
            value: total > 0 ? Math.round(((monto as number) / total) * 1000) / 10 : 0,
          }))
        );
      } catch {
        setPieData([]);
      }
    };
    cargar();
  }, [selectedYear, version]);

  /* Cargar Filtros Dinámicos desde el Backend  */
  useEffect(() => {
    documentosService.filtros()
      .then(data => {
        if (data.años && data.años.length > 0) {
          const listaAnios = data.años.map(String);
          setAños(listaAnios);
          // Si el año que tenemos seleccionado por defecto no existe en la BD, nos movemos al primero real
          if (!listaAnios.includes(selectedYear)) {
            setSelectedYear(listaAnios[0]);
          }
        }
        if (data.areas && data.areas.length > 0) {
          setAreas(['Total', ...data.areas]);
        }
      })
      .catch(() => {});
  }, [version]);

  /* Documentos  */
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await documentosService.listar();
        setDocumentos(data);
      } catch {
        setDocumentos([]);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [version]);

  /* ── FILTRADO EN TIEMPO REAL (Filtra la lista localmente con los Selectores + Barra de Búsqueda) ── */
  const documentosFiltrados = documentos.filter((doc) => {
    // 1. Validar Filtro de Año
    const coincideAnio = !selectedYear || String(doc.año) === selectedYear;

    // 2. Validar Filtro de Área o Categoría (Compara contra ambos campos por si acaso)
    const coincideArea = selectedArea === 'Total' || 
                         doc.area === selectedArea || 
                         doc.categoria === selectedArea;

    // 3. Validar Barra de Búsqueda por descripción o código
    const texto = busqueda.toLowerCase().trim();
    const coincideBusqueda = !texto || 
      (doc.descripcion && doc.descripcion.toLowerCase().includes(texto)) ||
      (doc.codigo && doc.codigo.toLowerCase().includes(texto));

    return coincideAnio && coincideArea && coincideBusqueda;
  });

  /* Notificación  */
  useEffect(() => {
    const verificar = () => {
      const ultima = localStorage.getItem('ultima_importacion');
      if (ultima && Number(ultima) > Date.now() - 5000) {
        setVersion(v => v + 1);
        localStorage.removeItem('ultima_importacion');
      }
    };
    const intervalo = setInterval(verificar, 1000);
    return () => clearInterval(intervalo);
  }, []);

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

  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── SECCIÓN AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '24px 30px 110px 30px', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
                { label: 'Año',          value: selectedYear, setter: setSelectedYear, options: años.map(a => [a, a]),                                    minWidth: '110px' },
                { label: 'Comparar con', value: compareYear,  setter: setCompareYear,  options: [['Comparar','Comparar'], ...años.map(a => [a, a])],       minWidth: '150px' },
                { label: 'Categoría / Área', value: selectedArea, setter: setSelectedArea, options: areas.map(a => [a, a]),                               minWidth: '140px' },
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
            <IonButton color="light"
              onClick={() => {
                if (isAuth && userRole === 'ciudadano') {
                  history.push('/app/perfil');
                } else if (isAuth && userRole === 'admin') {
                  history.push('/admin/perfil');
                } else {
                  history.push('/registro');
                }
              }}
              style={{
                width: '48px', height: '48px', '--border-radius': '50%',
                '--padding-start': '0', '--padding-end': '0',
              }}
            >
              <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          </div>
        </div>

        {/* Contenido  */}
        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <IonSpinner name="crescent" style={{ color: '#15305b' }} />
          </div>
        ) : (
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
                  {renderPieLegend(pieData)}
                  <div style={{ flex: 1 }}>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" outerRadius="65%"
                            dataKey="value" labelLine={true} label={renderCustomLabel}>
                            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v) => typeof v === 'number' ? `${v}%` : v} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: '13px' }}>
                        Sin datos para mostrar
                      </div>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* ── BÚSQUEDA Y ACCIONES ── */}
          <IonRow className="ion-align-items-center" style={{ marginTop: '28px', marginBottom: '12px' }}>
            <IonCol size="12" sizeMd="5">
              <IonSearchbar 
                value={busqueda}
                onIonInput={e => setBusqueda(e.detail.value!)}
                placeholder="Buscar por descripción o código..." 
                style={{
                  padding: 0, '--border-radius': '30px', '--box-shadow': 'none',
                  '--background': 'white', border: '1px solid #d5d5d5', borderRadius: '30px',
                }} 
              />
            </IonCol>
            <IonCol size="auto" style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
              <IonButton fill="outline" shape="round" style={{
                '--background': 'white', '--color': '#333', '--box-shadow': 'none',
                '--border-radius': '20px', '--border-color': '#d5d5d5', '--border-width': '1px', height: '42px',
              }}>
                Mes <IonIcon slot="end" icon={calendarOutline} style={{ color: '#555' }} />
              </IonButton>
              <IonButton fill="outline" shape="round" onClick={() => documentosService.descargarTodos()} style={{
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

          {/* Lista de Archivos */}
          <IonRow>
            <IonCol size="12">
              <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                <IonList lines="full" style={{ padding: 0 }}>
                  {documentosFiltrados.length === 0 ? (
                    <IonItem>
                      <IonLabel style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '10px 0' }}>
                        No se encontraron documentos para los filtros seleccionados.
                      </IonLabel>
                    </IonItem>
                  ) : (
                    documentosFiltrados.map((doc) => (
                      <IonItem 
                        key={doc.id} 
                        button 
                        detail={false} 
                        onClick={() => history.push(`/detalle-archivo/${doc.id}`)}
                        style={{
                          '--padding-start': '24px', '--padding-end': '16px',
                          '--min-height': '58px', '--border-color': '#ebebeb',
                        }}
                      >
                        <IonLabel style={{ fontWeight: '500', color: '#2a2a2a', fontSize: '15px' }}>
                          {doc.descripcion ?? doc.codigo ?? `Documento ${doc.id}`}
                        </IonLabel>
                        <IonIcon
                          slot="end"
                          icon={reorderThreeOutline}
                          style={{ color: '#aaa', fontSize: '22px', cursor: 'pointer' }}
                          onClick={(e) => { 
                            e.stopPropagation();
                            abrirMenu(e as any, doc.id); 
                          }}
                        />
                      </IonItem>
                    ))
                  )}
                </IonList>
              </IonCard>
            </IonCol>
          </IonRow>

        </IonGrid>)}

        {/* ── MENÚ CONTEXTUAL (POPOVER) ── */}
        <IonPopover
          isOpen={popoverOpen}
          event={popoverEvent}
          onDidDismiss={() => setPopoverOpen(false)}
          showBackdrop={false}
          style={{ '--width': '220px', '--border-radius': '14px', '--box-shadow': '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <IonList lines="full" style={{ padding: '4px 0' }}>
            <IonItem button detail={false} onClick={() => {
                setPopoverOpen(false);
                if (docSeleccionado) documentosService.descargarUno(docSeleccionado);
              }}
              style={{ '--padding-start': '16px', '--min-height': '52px' }}>
              <IonIcon icon={downloadOutline} style={{ color: '#333', marginRight: '12px', fontSize: '18px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222', fontSize: '14px' }}>Descargar</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} style={{ color: '#ccc', fontSize: '16px' }} />
            </IonItem>
            <IonItem button detail={false}
              onClick={() => {
                setPopoverOpen(false);
                history.push(`/detalle-archivo/${docSeleccionado}`);
              }}
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