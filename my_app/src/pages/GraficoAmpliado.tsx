import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { contractOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import HeaderLinks from '../components/HeaderLink';

/* ─── Datos ─────────────────────────────────────────────────────── */
const dataSinComparar = [
  { mes: 'Enero',      año1: 100000 },
  { mes: 'Febrero',    año1: 200000 },
  { mes: 'Marzo',      año1: 300000 },
  { mes: 'Abril',      año1: 100000 },
  { mes: 'Junio',      año1: 0 },
  { mes: 'Julio',      año1: 0 },
  { mes: 'Agosto',     año1: 0 },
  { mes: 'Septiembre', año1: 0 },
  { mes: 'Octubre',    año1: 0 },
  { mes: 'Noviembre',  año1: 0 },
];

const dataComparando = [
  { mes: 'Enero',      año1: 100000,  año2: 200000 },
  { mes: 'Febrero',    año1: 200000,  año2: 460000 },
  { mes: 'Marzo',      año1: 300000,  año2: 650000 },
  { mes: 'Abril',      año1: 100000,  año2: 80000  },
  { mes: 'Junio',      año1: 520000,  año2: 0      },
  { mes: 'Julio',      año1: 310000,  año2: 0      },
  { mes: 'Agosto',     año1: 400000,  año2: 0      },
  { mes: 'Septiembre', año1: 460000,  año2: 0      },
  { mes: 'Octubre',    año1: 800000,  año2: 0      },
  { mes: 'Noviembre',  año1: 100000,  año2: 0      },
];

/* ─── Componente ───────────────────────────────────────────────── */
interface GraficoAmpliadoProps {
  selectedYear?: string;
  compareYear?: string;
  selectedArea?: string;
}

const GraficoAmpliado: React.FC<GraficoAmpliadoProps> = ({
  selectedYear = '2026',
  compareYear = 'Comparar',
  selectedArea = 'Salud',
}) => {
  const history = useHistory();
  const comparando = compareYear !== 'Comparar';
  const data = comparando ? dataComparando : dataSinComparar;
  const titulo = comparando
    ? `${selectedArea} ${selectedYear} vs ${compareYear}`
    : selectedArea;

  return (
    <IonPage>
      {/* ── BARRA SUPERIOR ── */}
      <HeaderLinks/>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b',
          padding: '20px 30px 60px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          {/* Selectores (solo visuales, sin lógica aquí) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { label: 'Año', value: selectedYear },
              { label: 'Comparar con', value: compareYear },
              { label: 'Area', value: selectedArea },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                <div style={{
                  backgroundColor: 'white',
                  color: '#15305b',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontWeight: '600',
                  fontSize: '14px',
                  minWidth: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}>
                  {value}
                  <span style={{ fontSize: '10px' }}>▾</span>
                </div>
              </div>
            ))}
          </div>

          <IonButton
            color="light"
            style={{ width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0', marginTop: '6px' }}
          >
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        {/* ── GRÁFICO AMPLIADO ── */}
        <div style={{ marginTop: '-30px', padding: '0 20px 40px 20px' }}>
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', margin: '0' }}>
            <IonCardContent style={{ padding: '24px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '18px', textAlign: 'center' }}>
                    {titulo}
                  </h2>
                </div>
                <IonButton
                  fill="clear"
                  onClick={() => history.goBack()}
                  style={{ '--padding-start': '4px', '--padding-end': '4px', marginTop: '-4px' }}
                >
                  <IonIcon icon={contractOutline} style={{ color: '#999', fontSize: '22px' }} />
                </IonButton>
              </div>

              {/* Gráfico */}
              <div style={{ height: '520px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }} barSize={comparando ? 16 : 24}>
                    <CartesianGrid vertical={false} stroke="#e8e8e8" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#888' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v === 0 ? '0' : `${(v / 1000).toFixed(0)}.000`}
                    />
                    <Tooltip formatter={(v) => typeof v === 'number' ? v.toLocaleString('es-CL') : v} />
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
            </IonCardContent>
          </IonCard>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default GraficoAmpliado;