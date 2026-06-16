import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { contractOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import HeaderLinks from '../components/HeaderLink';
import { gastosService } from '../services/api';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

// Agrupa los gastos de la API por mes, sumando montos
const agruparPorMes = (gastos: any[]): Record<string, number> => {
  const resultado: Record<string, number> = {};
  MESES.forEach(m => resultado[m] = 0);
  gastos.forEach(g => {
    const nombreMes = MESES[g.mes - 1];
    if (nombreMes) resultado[nombreMes] += g.monto;
  });
  return resultado;
};

// Construye el array que recharts necesita
const construirData = (
  porMes1: Record<string, number>,
  porMes2: Record<string, number> | null
) =>
  MESES.map(mes => ({
    mes,
    año1: porMes1[mes] ?? 0,
    ...(porMes2 ? { año2: porMes2[mes] ?? 0 } : {}),
  }));

const GraficoAmpliado: React.FC = () => {
  const history = useHistory();

  const [selectedYear, setSelectedYear] = useState('2025');
  const [compareYear,  setCompareYear]  = useState('Comparar');
  const [selectedArea, setSelectedArea] = useState('Total');

  const [años,  setAños]  = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const [data,    setData]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Cargar años y áreas disponibles desde la API de documentos/gastos
  useEffect(() => {
    gastosService.filtros().then((f: any) => {
      if (f?.años)  setAños(f.años.map(String));
      if (f?.areas) setAreas(['Total', ...f.areas]);
    }).catch(() => {});
  }, []);

  // Cargar datos cada vez que cambian los filtros
  useEffect(() => {
    setLoading(true);
    setError('');

    const area = selectedArea === 'Total' ? undefined : selectedArea;

    const fetch1 = gastosService.listar(Number(selectedYear), area);
    const fetch2 = compareYear !== 'Comparar'
      ? gastosService.listar(Number(compareYear), area)
      : Promise.resolve(null);

    Promise.all([fetch1, fetch2])
      .then(([gastos1, gastos2]) => {
        const porMes1 = agruparPorMes(gastos1 ?? []);
        const porMes2 = gastos2 ? agruparPorMes(gastos2) : null;
        setData(construirData(porMes1, porMes2));
      })
      .catch(() => setError('Error al cargar los datos de gastos'))
      .finally(() => setLoading(false));
  }, [selectedYear, compareYear, selectedArea]);

  const comparando = compareYear !== 'Comparar';
  const titulo = comparando
    ? `${selectedArea} — ${selectedYear} vs ${compareYear}`
    : `${selectedArea} — ${selectedYear}`;

  const selectStyle: React.CSSProperties = {
    backgroundColor: 'white', color: '#15305b', borderRadius: '20px',
    padding: '4px 16px', fontWeight: '600', fontSize: '14px',
    border: 'none', minWidth: '110px',
  };

  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '20px 30px 60px 30px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Selector Año principal */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Año</span>
              <IonSelect
                value={selectedYear}
                onIonChange={e => setSelectedYear(e.detail.value)}
                interface="popover"
                style={selectStyle}
              >
                {(años.length > 0 ? años : ['2024','2025','2026']).map(a => (
                  <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                ))}
              </IonSelect>
            </div>

            {/* Selector Comparar con */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Comparar con</span>
              <IonSelect
                value={compareYear}
                onIonChange={e => setCompareYear(e.detail.value)}
                interface="popover"
                style={{ ...selectStyle, minWidth: '150px' }}
              >
                <IonSelectOption value="Comparar">Sin comparar</IonSelectOption>
                {(años.length > 0 ? años : ['2024','2025','2026'])
                  .filter(a => a !== selectedYear)
                  .map(a => (
                    <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                  ))
                }
              </IonSelect>
            </div>

            {/* Selector Área */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Área</span>
              <IonSelect
                value={selectedArea}
                onIonChange={e => setSelectedArea(e.detail.value)}
                interface="popover"
                style={{ ...selectStyle, minWidth: '160px' }}
              >
                {(areas.length > 0 ? areas : ['Total']).map(a => (
                  <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                ))}
              </IonSelect>
            </div>

          </div>

          <IonButton color="light" style={{
            width: '48px', height: '48px', '--border-radius': '50%',
            '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        {/* ── GRÁFICO ── */}
        <div style={{ marginTop: '-30px', padding: '0 20px 40px 20px' }}>
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', margin: '0' }}>
            <IonCardContent style={{ padding: '24px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '18px', flex: 1, textAlign: 'center' }}>
                  {titulo}
                </h2>
                <IonButton fill="clear" onClick={() => history.goBack()}
                  style={{ '--padding-start': '4px', '--padding-end': '4px', marginTop: '-4px' }}>
                  <IonIcon icon={contractOutline} style={{ color: '#999', fontSize: '22px' }} />
                </IonButton>
              </div>

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                  <IonSpinner name="crescent" style={{ color: '#15305b' }} />
                </div>
              )}

              {error && (
                <div style={{ backgroundColor: '#f8d7da', borderRadius: '10px', padding: '16px', color: '#842029', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div style={{ height: '520px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }} barSize={comparando ? 16 : 24}>
                      <CartesianGrid vertical={false} stroke="#e8e8e8" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#888' }}
                        axisLine={false} tickLine={false}
                        tickFormatter={(v) => v === 0 ? '0' : `$${(v / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        formatter={(v: any) => [`$${Number(v).toLocaleString('es-CL')}`, '']}
                        labelStyle={{ fontWeight: '600' }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                        formatter={(value) => value === 'año1' ? `Año ${selectedYear}` : `Año ${compareYear}`}
                      />
                      <Bar dataKey="año1" name="año1" fill="#1a9cd8" radius={[4, 4, 0, 0]} />
                      {comparando && (
                        <Bar dataKey="año2" name="año2" fill="#3d5fad" radius={[4, 4, 0, 0]} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

            </IonCardContent>
          </IonCard>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default GraficoAmpliado;