import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonGrid, IonSpinner, IonRow, IonCol,
  IonSelect, IonSelectOption, IonSearchbar, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonCard, IonPopover,
  useIonViewWillEnter // ◄── 1. Importamos el hook del ciclo de vida de Ionic
} from '@ionic/react';
import {
  downloadOutline, expandOutline, personOutline, calendarOutline,
  reorderThreeOutline, informationCircleOutline, chevronForwardOutline,
  documentTextOutline, libraryOutline, shieldCheckmarkOutline,
} from 'ionicons/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';
import { gastosService, documentosService } from '../services/api';

/* ── Constantes ── */
const MESES = [
  { label: 'Enero', num: 1 }, { label: 'Febrero', num: 2 }, { label: 'Marzo', num: 3 },
  { label: 'Abril', num: 4 }, { label: 'Mayo', num: 5 }, { label: 'Junio', num: 6 },
  { label: 'Julio', num: 7 }, { label: 'Agosto', num: 8 }, { label: 'Septiembre', num: 9 },
  { label: 'Octubre', num: 10 }, { label: 'Noviembre', num: 11 }, { label: 'Diciembre', num: 12 },
];

const PIE_COLORS = ['#2a6095', '#1a9cd8', '#4ab8e8', '#3d7abf', '#27ae60', '#e67e22', '#8e44ad', '#c0392b'];

/* ── Helpers ── */
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

/* ── Props ── */
interface InicioPublicoProps {
  userRole?: 'ciudadano' | 'admin' | null;
  isAuth?: boolean;
}

/* ── Componente ── */
const InicioPublico: React.FC<InicioPublicoProps> = ({ userRole, isAuth = false }) => {
  const history = useHistory();

  const [selectedYear, setSelectedYear] = useState('2025');
  const [compareYear,  setCompareYear]  = useState('Comparar');
  const [selectedArea, setSelectedArea] = useState('Total');
  const [busqueda,     setBusqueda]     = useState('');

  const [popoverOpen,    setPopoverOpen]    = useState(false);
  const [popoverEvent,   setPopoverEvent]   = useState<any>(null);
  const [docSeleccionado, setDocSeleccionado] = useState<number | null>(null);

  const [barData,    setBarData]    = useState<any[]>([]);
  const [pieData,    setPieData]    = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [años,       setAños]       = useState<string[]>(['2025', '2026']);
  const [areas,      setAreas]      = useState<string[]>(['Total']);
  const [cargando,   setCargando]   = useState(true);

  // ── 2. Gatillo de refresco automático al entrar en la vista ──
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useIonViewWillEnter(() => {
    setRefreshTrigger(prev => prev + 1);
  });

  const comparando    = compareYear !== 'Comparar';
  const tituloGrafico = comparando
    ? `${selectedArea} ${selectedYear} vs ${compareYear}`
    : selectedArea;

  const abrirMenu = (e: React.MouseEvent, id: number) => {
    e.persist();
    setDocSeleccionado(id);
    setPopoverEvent(e);
    setPopoverOpen(true);
  };

  /* ── Cargar filtros dinámicos (años y áreas desde la BD) ── */
  useEffect(() => {
    gastosService.filtros()
      .then((data: any) => {
        if (data?.años?.length > 0) {
          const listaAños = data.años.map(String);
          setAños(listaAños);
          if (!listaAños.includes(selectedYear)) setSelectedYear(listaAños[0]);
        }
        if (data?.areas?.length > 0) {
          setAreas(['Total', ...data.areas]);
        }
      })
      .catch(() => {});
  }, [refreshTrigger]); // ◄── 3. Agregado refreshTrigger aquí

  /* ── Cargar gráfico de barras ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const area = selectedArea === 'Total' ? undefined : selectedArea;
        const data1 = await gastosService.listar(Number(selectedYear), area) ?? [];
        const data2 = comparando
          ? await gastosService.listar(Number(compareYear), area) ?? []
          : [];

        // Agrupa por mes sumando montos (puede haber varias filas por mes y área)
        const sumarPorMes = (datos: any[]) => {
          const mapa: Record<number, number> = {};
          datos.forEach((d: any) => {
            mapa[d.mes] = (mapa[d.mes] ?? 0) + d.monto;
          });
          return mapa;
        };

        const mapa1 = sumarPorMes(data1);
        const mapa2 = sumarPorMes(data2);

        setBarData(MESES.map(({ label, num }) => ({
          mes:  label,
          año1: mapa1[num] ?? 0,
          ...(comparando ? { año2: mapa2[num] ?? 0 } : {}),
        })));
      } catch {
        setBarData(MESES.map(({ label }) => ({ mes: label, año1: 0 })));
      }
    };
    cargar();
  }, [selectedYear, compareYear, selectedArea, refreshTrigger]); // ◄── 3. Agregado refreshTrigger aquí

  /* ── Cargar pie ── */
  useEffect(() => {
    gastosService.listar(Number(selectedYear))
      .then((data: any[]) => {
        if (!data?.length) { setPieData([]); return; }
        const porArea: Record<string, number> = {};
        data.forEach((d: any) => {
          porArea[d.area] = (porArea[d.area] ?? 0) + d.monto;
        });
        const total = Object.values(porArea).reduce((a, b) => a + b, 0);
        setPieData(
          Object.entries(porArea).map(([name, monto]) => ({
            name,
            value: total > 0 ? Math.round((monto / total) * 1000) / 10 : 0,
          }))
        );
      })
      .catch(() => setPieData([]));
  }, [selectedYear, refreshTrigger]); // ◄── 3. Agregado refreshTrigger aquí

  /* ── Cargar documentos ── */
  useEffect(() => {
    setCargando(true);
    documentosService.listar()
      .then((data: any[]) => setDocumentos(data ?? []))
      .catch(() => setDocumentos([]))
      .finally(() => setCargando(false));
  }, [refreshTrigger]); // ◄── 3. Agregado refreshTrigger aquí

  /* ── Filtrar documentos por búsqueda ── */
  const documentosFiltrados = documentos.filter(doc => {
    const texto = busqueda.toLowerCase();
    return (
      doc.descripcion?.toLowerCase().includes(texto) ||
      doc.codigo?.toLowerCase().includes(texto) ||
      doc.categoria?.toLowerCase().includes(texto)
    );
  });

  const selectStyle: React.CSSProperties = {
    backgroundColor: 'white', color: '#15305b', borderRadius: '20px',
    padding: '1px 20px', minWidth: '130px', fontWeight: '600',
    fontSize: '14px', border: 'none',
  };

  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── SECCIÓN AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '24px 30px 110px 30px',
          color: 'white', display: 'flex', flexDirection: 'column',
          gap: '20px', borderBottomRightRadius: '80px',
        }}>

          {/* Fila 1: Logo y Perfil */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/SantoDomingoIcono.png" alt="Logo Santo Domingo"
                style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Municipalidad de
                </span>
                <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>Santo Domingo</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {!isAuth && (
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '500', textAlign: 'right', lineHeight: '1.2' }}>
                  No has iniciado sesión<br />
                  <span style={{ fontSize: '12px', color: '#4ab8e8' }}>Modo visitante</span>
                </span>
              )}
              <IonButton color="light"
                onClick={() => {
                  if (!isAuth) history.push('/login');
                  else if (userRole === 'admin') history.push('/admin/perfil');
                  else history.push('/app/perfil');
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
              onClick={() => isAuth ? history.push('/app/solicitudes/nueva') : history.push('/login')}
              style={{ '--background': 'rgba(255,255,255,0.1)', '--color': 'white', '--border-radius': '20px', '--border-color': 'rgba(255,255,255,0.3)', '--border-style': 'solid', '--border-width': '1px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: '500', textTransform: 'none' }}
            >
              <IonIcon icon={documentTextOutline} slot="start" style={{ fontSize: '16px' }} />
              Solicitud de Transparencia
            </IonButton>

            <IonButton
              style={{ '--background': 'rgba(255,255,255,0.1)', '--color': 'white', '--border-radius': '20px', '--border-color': 'rgba(255,255,255,0.3)', '--border-style': 'solid', '--border-width': '1px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: '500', textTransform: 'none' }}
            >
              <IonIcon icon={libraryOutline} slot="start" style={{ fontSize: '16px' }} />
              importar datos
            </IonButton>

            {isAuth && userRole === 'admin' && (
              <IonButton
                onClick={() => history.push('/admin/dashboard')}
                style={{ '--background': '#ffc107', '--color': '#15305b', '--border-radius': '20px', '--box-shadow': 'none', height: '36px', fontSize: '13px', fontWeight: 'bold', textTransform: 'none' }}
              >
                <IonIcon icon={shieldCheckmarkOutline} slot="start" style={{ fontSize: '16px' }} />
                Volver al panel de administrador
              </IonButton>
            )}
          </div>

          {/* Fila 3: Filtros dinámicos */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { label: 'Año',          value: selectedYear, setter: setSelectedYear, options: años.map(a => [a, a]),                                                         minWidth: '110px' },
              { label: 'Comparar con', value: compareYear,  setter: setCompareYear,  options: [['Comparar', 'Sin comparar'], ...años.map(a => [a, a])],                      minWidth: '150px' },
              { label: 'Área',         value: selectedArea, setter: setSelectedArea, options: areas.map(a => [a, a]),                                                        minWidth: '140px' },
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

            {/* ── GRÁFICOS ── */}
            <IonRow>
              {/* Gráfico de Barras */}
              <IonCol size="12" sizeMd="7">
                <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', margin: '0', height: '100%' }}>
                  <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>{tituloGrafico}</h3>
                    <IonIcon icon={expandOutline} style={{ cursor: 'pointer', color: '#999', fontSize: '20px' }}
                      onClick={() => history.push('/grafico-ampliado')} />
                  </div>
                  <div style={{ height: '350px', padding: '8px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barSize={comparando ? 14 : 20}>
                        <CartesianGrid vertical={false} stroke="#e8e8e8" />
                        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => v === 0 ? '0' : `$${(v / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString('es-CL')}`, '']} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                          formatter={(value) => value === 'año1' ? `Año ${selectedYear}` : `Año ${compareYear}`} />
                        <Bar dataKey="año1" name="año1" fill="#1a9cd8" radius={[4, 4, 0, 0]} />
                        {comparando && <Bar dataKey="año2" name="año2" fill="#3d5fad" radius={[4, 4, 0, 0]} />}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </IonCard>
              </IonCol>

              {/* Pie Chart */}
              <IonCol size="12" sizeMd="5">
                <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', margin: '0', height: '100%' }}>
                  <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>
                      Distribución por Área — {selectedYear}
                    </h3>
                    <IonIcon icon={expandOutline} style={{ cursor: 'pointer', color: '#999', fontSize: '20px' }}
                      onClick={() => history.push(`/grafico-pie-ampliado?año=${selectedYear}`)} />
                  </div>
                  <div style={{ height: '350px', padding: '8px' }}>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" outerRadius="60%"
                            dataKey="value" labelLine={true} label={renderCustomLabel}>
                            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: any) => [`${v}%`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: '13px' }}>
                        Sin datos para mostrar
                      </div>
                    )}
                  </div>
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
                  style={{ padding: 0, '--border-radius': '30px', '--box-shadow': 'none', '--background': 'white', border: '1px solid #d5d5d5', borderRadius: '30px' }}
                />
              </IonCol>
              <IonCol size="auto" style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
                <IonButton fill="outline" shape="round" style={{ '--background': 'white', '--color': '#333', '--box-shadow': 'none', '--border-radius': '20px', '--border-color': '#d5d5d5', '--border-width': '1px', height: '42px' }}>
                  Mes <IonIcon slot="end" icon={calendarOutline} style={{ color: '#555' }} />
                </IonButton>
                <IonButton fill="outline" shape="round" onClick={() => documentosService.descargarTodos()} style={{ '--background': 'white', '--border-color': '#d5d5d5', '--border-width': '1px', '--padding-start': '0', '--padding-end': '0', width: '44px', height: '44px' }}>
                  <IonIcon slot="icon-only" icon={downloadOutline} style={{ color: '#555' }} />
                </IonButton>
                <IonButton onClick={() => history.push('/lista-ampliada')} fill="outline" shape="round" style={{ '--background': 'white', '--border-color': '#d5d5d5', '--border-width': '1px', '--padding-start': '0', '--padding-end': '0', width: '44px', height: '44px' }}>
                  <IonIcon slot="icon-only" icon={expandOutline} style={{ color: '#555' }} />
                </IonButton>
              </IonCol>
            </IonRow>

            {/* ── LISTA DE DOCUMENTOS ── */}
            <IonRow>
              <IonCol size="12">
                <IonCard style={{ borderRadius: '16px', margin: '0', border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                  <IonList lines="full" style={{ padding: 0 }}>
                    {documentosFiltrados.length === 0 ? (
                      <IonItem>
                        <IonLabel style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '10px 0' }}>
                          {busqueda ? 'No se encontraron documentos.' : 'No hay documentos disponibles.'}
                        </IonLabel>
                      </IonItem>
                    ) : (
                      documentosFiltrados.map((doc) => (
                        <IonItem key={doc.id} button detail={false}
                          onClick={() => history.push(`/detalle-archivo/${doc.id}`)}
                          style={{ '--padding-start': '24px', '--padding-end': '16px', '--min-height': '58px', '--border-color': '#ebebeb' }}
                        >
                          <IonLabel style={{ fontWeight: '500', color: '#2a2a2a', fontSize: '15px' }}>
                            {doc.descripcion ?? doc.codigo ?? `Documento ${doc.id}`}
                          </IonLabel>
                          <IonIcon slot="end" icon={reorderThreeOutline}
                            style={{ color: '#aaa', fontSize: '22px', cursor: 'pointer' }}
                            onClick={(e) => { e.stopPropagation(); abrirMenu(e as any, doc.id); }}
                          />
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
        <IonPopover isOpen={popoverOpen} event={popoverEvent} onDidDismiss={() => setPopoverOpen(false)}
          showBackdrop={false} style={{ '--width': '220px', '--border-radius': '14px', '--box-shadow': '0 4px 20px rgba(0,0,0,0.15)' }}>
          <IonList lines="full" style={{ padding: '4px 0' }}>
            <IonItem button detail={false}
              onClick={() => { setPopoverOpen(false); if (docSeleccionado) documentosService.descargarUno(docSeleccionado); }}
              style={{ '--padding-start': '16px', '--min-height': '52px' }}>
              <IonIcon icon={downloadOutline} style={{ color: '#333', marginRight: '12px', fontSize: '18px' }} />
              <IonLabel style={{ fontWeight: '500', color: '#222', fontSize: '14px' }}>Descargar</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} style={{ color: '#ccc', fontSize: '16px' }} />
            </IonItem>
            <IonItem button detail={false}
              onClick={() => { setPopoverOpen(false); history.push(`/detalle-archivo/${docSeleccionado}`); }}
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