import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { personOutline, downloadOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';
import { documentosService } from '../services/api';

const DetalleArchivo: React.FC = () => {
  const history               = useHistory();
  const { id }                = useParams<{ id: string }>();
  const [doc, setDoc]         = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      documentosService.obtener(Number(id))
        .then(data => setDoc(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const campos = doc ? [
    { label: 'Código',      valor: doc.codigo },
    { label: 'Tipo',        valor: doc.tipo },
    { label: 'Categoría',   valor: doc.categoria },
    { label: 'Área',        valor: doc.area },
    { label: 'Fecha',       valor: doc.fecha_pub },
    { label: 'Descripción', valor: doc.descripcion },
    { label: 'Enlace',      valor: doc.enlace },
  ].filter(c => c.valor) : [];

  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL ── */}
        <div style={{
          backgroundColor: '#15305b',
          padding: '20px 30px 80px 30px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

            {/* Botón descargar */}
            {id && (
              <IonButton
                color="light"
                onClick={() => documentosService.descargarUno(Number(id))}
                style={{
                  '--border-radius': '12px', '--box-shadow': 'none',
                  fontWeight: '600', fontSize: '13px', height: '42px',
                }}
              >
                <IonIcon slot="start" icon={downloadOutline} style={{ color: '#15305b' }} />
                Descargar
              </IonButton>
            )}

            {/* Botón volver */}
            <IonButton
              onClick={() => history.goBack()}
              style={{
                '--background': 'white', '--color': '#15305b',
                '--border-radius': '12px', '--box-shadow': 'none',
                fontWeight: '600', fontSize: '14px', height: '42px',
              }}
            >
              Volver
            </IonButton>

            {/* Botón usuario */}
            <IonButton color="light" style={{
              width: '48px', height: '48px', '--border-radius': '50%',
              '--padding-start': '0', '--padding-end': '0',
            }}>
              <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
            </IonButton>
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ marginTop: '-50px', padding: '0 24px 40px 24px' }}>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <IonSpinner name="crescent" style={{ color: '#15305b' }} />
            </div>
          )}

          {!loading && !doc && (
            <div style={{
              backgroundColor: '#f8d7da', borderRadius: '12px',
              padding: '16px', color: '#842029',
            }}>
              No se pudo cargar el documento.
            </div>
          )}

          {!loading && doc && (
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              border: '1px solid #d0d8e4',
            }}>
              {campos.map((campo, index) => (
                <div key={index} style={{
                  display: 'grid', gridTemplateColumns: '38% 62%',
                  borderBottom: index < campos.length - 1 ? '1px solid #c5d2e0' : 'none',
                }}>
                  {/* Celda izquierda azul */}
                  <div style={{
                    backgroundColor: '#1a4a8a', padding: '14px 20px',
                    color: 'white', fontWeight: '600', fontSize: '13px',
                    display: 'flex', alignItems: 'center',
                    borderRight: '1px solid #2a5a9a',
                  }}>
                    {campo.label}
                  </div>

                  {/* Celda derecha blanca */}
                  <div style={{
                    backgroundColor: 'white', padding: '14px 20px',
                    color: '#2a2a2a', fontSize: '13px',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {campo.label.toLowerCase().includes('fecha') ? (
                      <span style={{
                        backgroundColor: '#e8edf2', borderRadius: '6px',
                        padding: '3px 10px', fontSize: '13px', color: '#333',
                      }}>
                        {campo.valor}
                      </span>
                    ) : campo.label.toLowerCase() === 'enlace' ? (
                      <a
                        href={campo.valor}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#1a9cd8', textDecoration: 'underline' }}
                      >
                        Ver documento
                      </a>
                    ) : campo.valor}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default DetalleArchivo;