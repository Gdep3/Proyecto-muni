import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
// Importamos documentTextOutline para los botones de los PDFs
import { personOutline, downloadOutline, documentTextOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import HeaderLinks from '../components/HeaderLink';
import { documentosService } from '../services/api';

const DetalleArchivo: React.FC = () => {
  const history               = useHistory();
  const { id }                = useParams<{ id: string }>();
  const [doc, setDoc]         = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // NUEVO: Estado para controlar qué PDF se está visualizando en el visor inferior
  const [pdfActivo, setPdfActivo] = useState<'contrato' | 'acto'>('contrato');

  useEffect(() => {
    if (id) {
      documentosService.obtener(Number(id))
        .then(data => {
          setDoc(data);
          if (!data.enlace_contrato && data.enlace_acto) {
            setPdfActivo('acto');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Lista de campos técnicos para la tabla informativa
  const campos = doc ? [
    { label: 'Código',      valor: doc.codigo },
    { label: 'Tipo',        valor: doc.tipo },
    { label: 'Categoría',   valor: doc.categoria },
    { label: 'Área',        valor: doc.area },
    { label: 'Fecha',       valor: doc.fecha_pub },
    { label: 'Descripción', valor: doc.descripcion },
  ].filter(c => c.valor) : [];

  const obtenerNombreArchivo = (url: string) => {
    if (!url) return '';
    try {
      const partes = url.split('/');
      const nombreConQuery = partes[partes.length - 1]; // Toma la última parte
      return decodeURIComponent(nombreConQuery.split('?')[0]); // Quita parámetros de Supabase y decodifica espacios
    } catch (e) {
      return 'Archivo.pdf';
    }
  };
  return (
    <IonPage>
      <HeaderLinks />

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── FRANJA AZUL SUPERIOR ── */}
        <div style={{
          backgroundColor: '#15305b',
          padding: '20px 30px 80px 30px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

            {/* Botón descargar unificado de la plataforma */}
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
                Descargar Todo
              </IonButton>
            )}

            {/* Botón volver */}
            <IonButton
              onClick={() => history.push('/inicio')}
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

        {/* ── SECCIÓN CENTRAL DE CONTENIDO ── */}
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
            <>
              {/* Tarjeta Informativa de la Fila del Excel */}
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                border: '1px solid #d0d8e4',
                backgroundColor: 'white',
                marginBottom: '24px'
              }}>
                {campos.map((campo, index) => (
                  <div key={index} style={{
                    display: 'grid', gridTemplateColumns: '38% 62%',
                    borderBottom: index < campos.length - 1 ? '1px solid #c5d2e0' : 'none',
                  }}>
                    {/* Celda de encabezado */}
                    <div style={{
                      backgroundColor: '#1a4a8a', padding: '14px 20px',
                      color: 'white', fontWeight: '600', fontSize: '13px',
                      display: 'flex', alignItems: 'center',
                      borderRight: '1px solid #2a5a9a',
                    }}>
                      {campo.label}
                    </div>

                    {/* Celda de datos */}
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
                      ) : campo.valor}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── SECCIÓN DE VISUALIZACIÓN DE ARCHIVOS DOBLES ── */}
              {(doc.enlace_contrato || doc.enlace_acto) && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                  border: '1px solid #d0d8e4',
                }}>
                  <h3 style={{ color: '#15305b', marginTop: 0, marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>
                    Documentos Adjuntos del Proceso
                  </h3>
                  <p style={{ color: '#666', fontSize: '13px', marginTop: 0, marginBottom: '20px' }}>
                    Este registro contiene 2 archivos independientes. Haz clic en cualquiera para cambiar la vista previa:
                  </p>

                  {/* PANEL DE TARJETAS SIMULTÁNEAS (Ambos nombres visibles a la vez) */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: doc.enlace_contrato && doc.enlace_acto ? '1fr 1fr' : '1fr', 
                    gap: '16px', 
                    marginBottom: '20px' 
                  }}>
                    
                    {/* Tarjeta 1: Contrato */}
                    {doc.enlace_contrato && (
                      <div 
                        onClick={() => setPdfActivo('contrato')}
                        style={{
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: pdfActivo === 'contrato' ? '2px solid #1a4a8a' : '1px solid #c5d2e0',
                          backgroundColor: pdfActivo === 'contrato' ? '#f4f7fb' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          boxShadow: pdfActivo === 'contrato' ? '0 2px 10px rgba(26,74,138,0.15)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ 
                          backgroundColor: pdfActivo === 'contrato' ? '#1a4a8a' : '#e8edf2', 
                          color: pdfActivo === 'contrato' ? 'white' : '#1a4a8a',
                          borderRadius: '8px', padding: '8px', display: 'flex' 
                        }}>
                          <IonIcon icon={documentTextOutline} style={{ fontSize: '20px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1a4a8a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Documento 1: Contrato / Gasto
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: pdfActivo === 'contrato' ? '600' : '400', color: '#2a2a2a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {obtenerNombreArchivo(doc.enlace_contrato)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tarjeta 2: Acto Administrativo */}
                    {doc.enlace_acto && (
                      <div 
                        onClick={() => setPdfActivo('acto')}
                        style={{
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: pdfActivo === 'acto' ? '2px solid #1a4a8a' : '1px solid #c5d2e0',
                          backgroundColor: pdfActivo === 'acto' ? '#f4f7fb' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          boxShadow: pdfActivo === 'acto' ? '0 2px 10px rgba(26,74,138,0.15)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ 
                          backgroundColor: pdfActivo === 'acto' ? '#1a4a8a' : '#e8edf2', 
                          color: pdfActivo === 'acto' ? 'white' : '#1a4a8a',
                          borderRadius: '8px', padding: '8px', display: 'flex' 
                        }}>
                          <IonIcon icon={documentTextOutline} style={{ fontSize: '20px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1a4a8a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Documento 2: Acto Administrativo
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: pdfActivo === 'acto' ? '600' : '400', color: '#2a2a2a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {obtenerNombreArchivo(doc.enlace_acto)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Link de descarga para el archivo seleccionado */}
                  <div style={{ marginBottom: '14px', backgroundColor: '#f8f9fa', padding: '8px 12px', borderRadius: '8px', display: 'inline-block' }}>
                    <span style={{ fontSize: '12px', color: '#666', marginRight: '8px' }}>Estás viendo:</span>
                    <a 
                      href={pdfActivo === 'contrato' ? doc.enlace_contrato : doc.enlace_acto} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: '#1a9cd8', fontSize: '13px', fontWeight: '600', textDecoration: 'none'}}
                    >
                      Abrir "{obtenerNombreArchivo(pdfActivo === 'contrato' ? doc.enlace_contrato : doc.enlace_acto)}" en pestaña nueva
                    </a>
                  </div>

                  {/* Visor de PDF Dinámico */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '600px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #c5d2e0'
                  }}>
                    <iframe
                      key = {pdfActivo}
                      src={`${pdfActivo === 'contrato' ? doc.enlace_contrato : doc.enlace_acto}#toolbar=1`}
                      title="Visor PDF Dinámico"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default DetalleArchivo;