import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';
 
/* ─── Datos de ejemplo ─────────────────────────────────────────── */
const campos = [
  { label: 'Año',                                                        valor: '2025' },
  { label: 'Mes',                                                        valor: 'Noviembre' },
  { label: 'Tipo de Compra',                                             valor: 'Otras Compras Bienes Muebles y Servicios' },
  { label: 'Tipo de acto administrativo aprobatorio',                    valor: 'Resolución Exenta' },
  { label: 'Denominación del acto administrativo aprobatorio',           valor: 'Autoriza fondos globales en efectivo para operaciones menores del Consejo para la Transparencia, año 2025.' },
  { label: 'Fecha del acto administrativo aprobatorio del contrato',     valor: '20/1/2025' },
  { label: 'Número del acto administrativo aprobatorio',                 valor: 'E51' },
  { label: 'Razón social',                                               valor: 'Sociedad Comercial Ossland SPA' },
  { label: 'Nombre',                                                     valor: 'Sociedad Comercial Ossland SPA' },
  { label: 'Primer apellido',                                            valor: 'No Aplica' },
  { label: 'Segundo apellido',                                           valor: 'No Aplica' },
  { label: 'RUT de la persona contratada (si aplica)',                   valor: '77.570.903-0' },
  { label: 'Socios y accionistas principales (si corresponde, no aplica a compras menores 3UTM)', valor: 'N.A.' },
  { label: 'Objeto de la contratación o adquisición',                    valor: 'Compra de caramelos corporativos CPLT.' },
  { label: 'Fecha de inicio del contrato (dd/mm/aa)',                    valor: '18/11/2025' },
  { label: 'Fecha de término del contrato (dd/mm/aa)',                   valor: '18/11/2025' },
  { label: 'Monto total de la operación',                                valor: '$160.650' },
];
 
/* ─── Componente ───────────────────────────────────────────────── */
const DetalleArchivo: React.FC = () => {
  const history = useHistory();
 
  return (
    <IonPage>
      {/* ── BARRA SUPERIOR ── */}
      <HeaderLinks/>
 
      <IonContent style={{ '--background': '#f0f2f5' }}>
 
        {/* ── FRANJA AZUL CON BOTÓN VOLVER ── */}
        <div style={{
          backgroundColor: '#15305b',
          padding: '20px 30px 80px 30px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <IonButton
              onClick={() => history.goBack()}
              style={{
                '--background': 'white',
                '--color': '#15305b',
                '--border-radius': '12px',
                '--box-shadow': 'none',
                fontWeight: '600',
                fontSize: '14px',
                height: '42px',
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              Volver
            </IonButton>
            <IonButton
              color="light"
              style={{ width: '48px', height: '48px', '--border-radius': '50%', '--padding-start': '0', '--padding-end': '0' }}
            >
              <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          </div>
        </div>
 
        {/* ── TABLA DE DETALLE ── */}
        <div style={{ marginTop: '-50px', padding: '0 24px 40px 24px' }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            border: '1px solid #d0d8e4',
          }}>
            {campos.map((campo, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '38% 62%',
                  borderBottom: index < campos.length - 1 ? '1px solid #c5d2e0' : 'none',
                }}
              >
                {/* Celda izquierda (azul) */}
                <div style={{
                  backgroundColor: '#1a4a8a',
                  padding: '14px 20px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRight: '1px solid #2a5a9a',
                }}>
                  {campo.label}
                </div>
                {/* Celda derecha (blanca) */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '14px 20px',
                  color: '#2a2a2a',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {/* Algunas fechas van con fondo gris claro como en el diseño */}
                  {campo.label.toLowerCase().includes('fecha') ? (
                    <span style={{
                      backgroundColor: '#e8edf2',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '13px',
                      color: '#333',
                    }}>
                      {campo.valor}
                    </span>
                  ) : campo.valor}
                </div>
              </div>
            ))}
          </div>
        </div>
 
      </IonContent>
    </IonPage>
  );
};
 
export default DetalleArchivo;