import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonPopover,
  IonSpinner,
} from '@ionic/react';
import {
  personOutline,
  downloadOutline,
  swapVerticalOutline,
  reorderThreeOutline,
  informationCircleOutline,
  chevronForwardOutline,
  contractOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { documentosService } from '../services/api';

const ListaArchivoAmpliada: React.FC = () => {
  const history = useHistory();

  const [selectedYear, setSelectedYear]         = useState('2026');
  const [compareYear, setCompareYear]           = useState('Comparar');
  const [selectedArea, setSelectedArea]         = useState('Salud');
  const [popoverOpen, setPopoverOpen]           = useState(false);
  const [popoverEvent, setPopoverEvent]         = useState<any>(null);
  const [documentos, setDocumentos]             = useState<any[]>([]);
  const [docSeleccionado, setDocSeleccionado]   = useState<number | null>(null);
  const [loading, setLoading]                   = useState(true);
  const [busqueda, setBusqueda]                 = useState('');
  const [ordenAsc, setOrdenAsc]                 = useState(true);

  useEffect(() => {
    documentosService.listar()
      .then(data => setDocumentos(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const abrirMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDocSeleccionado(id);
    setPopoverEvent(e);
    setPopoverOpen(true);
  };

  // Filtrar por búsqueda
  const filtrados = documentos
    .filter(doc => {
      const texto = busqueda.toLowerCase();
      return (
        doc.descripcion?.toLowerCase().includes(texto) ||
        doc.codigo?.toLowerCase().includes(texto) ||
        doc.categoria?.toLowerCase().includes(texto)
      );
    })
    .sort((a, b) => {
      const labelA = a.descripcion ?? a.codigo ?? '';
      const labelB = b.descripcion ?? b.codigo ?? '';
      return ordenAsc
        ? labelA.localeCompare(labelB)
        : labelB.localeCompare(labelA);
    });

  const selectStyle: React.CSSProperties & Record<string, any> = {
    backgroundColor: 'white',
    color: '#15305b',
    borderRadius: '20px',
    padding: '1px 20px',
    fontWeight: '600',
    fontSize: '14px',
    border: 'none',
    '--highlight-color-focused': 'transparent',
    '--border-color': 'transparent',
  };

  const btnStyle = {
    '--background': 'white',
    '--color': '#555',
    '--box-shadow': 'none',
    '--border-radius': '50%',
    '--padding-start': '0',
    '--padding-end': '0',
    '--border-width': '1px',
    '--border-color': '#d5d5d5',
    width: '46px',
    height: '46px',
  };

  return (
    <IonPage>

      <IonContent style={{ '--background': '#f0f2f5' }}>

        {/* ── SECCIÓN AZUL ── */}
        <div style={{
          backgroundColor: '#15305b', padding: '24px 30px 30px 30px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottomRightRadius: '80px',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { label: 'Año',          value: selectedYear, setter: setSelectedYear, options: [['2025','2025'],['2026','2026']],                                              minWidth: '110px' },
              { label: 'Comparar con', value: compareYear,  setter: setCompareYear,  options: [['Comparar','Comparar'],['2025','2025'],['2026','2026']],                      minWidth: '150px' },
              { label: 'Area',         value: selectedArea, setter: setSelectedArea, options: [['Total','Total'],['Salud','Salud'],['Compras','Compras Bienes y Servicios']], minWidth: '140px' },
            ].map(({ label, value, setter, options, minWidth }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                  {label}
                </span>
                <IonSelect value={value} onIonChange={e => setter(e.detail.value)}
                  interface="popover" style={{ ...selectStyle, minWidth }}>
                  {options.map(([val, txt]) => (
                    <IonSelectOption key={val} value={val}>{txt}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            ))}
          </div>

          <IonButton color="light" style={{
            width: '48px', height: '48px', '--border-radius': '50%',
            '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        {/* ── BARRA DE BÚSQUEDA Y ACCIONES ── */}
        <div style={{ padding: '20px 24px 12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, maxWidth: '360px' }}>
            <IonSearchbar
              placeholder="Buscar Archivo"
              value={busqueda}
              onIonInput={e => setBusqueda(e.detail.value ?? '')}
              style={{
                padding: 0, '--border-radius': '30px', '--box-shadow': 'none',
                '--background': 'white', border: '1px solid #d5d5d5', borderRadius: '30px',
              }}
            />
          </div>

          {/* Descargar todos */}
          <IonButton fill="outline" shape="round"
            onClick={() => documentosService.descargarTodos()}
            style={btnStyle as any}>
            <IonIcon slot="icon-only" icon={downloadOutline} style={{ color: '#555', fontSize: '20px' }} />
          </IonButton>

          {/* Ordenar A-Z / Z-A */}
          <IonButton fill="outline" shape="round"
            onClick={() => setOrdenAsc(!ordenAsc)}
            style={btnStyle as any}>
            <IonIcon slot="icon-only" icon={swapVerticalOutline} style={{ color: '#555', fontSize: '20px' }} />
          </IonButton>

          {/* Minimizar — volver */}
          <IonButton fill="outline" shape="round"
            onClick={() => history.goBack()}
            style={btnStyle as any}>
            <IonIcon slot="icon-only" icon={contractOutline} style={{ color: '#555', fontSize: '20px' }} />
          </IonButton>
        </div>

        {/* ── LISTA ── */}
        <div style={{ padding: '0 20px 40px 20px' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            border: '1px solid #e0e0e0', overflow: 'hidden',
          }}>
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <IonSpinner name="crescent" style={{ color: '#15305b' }} />
              </div>
            )}

            {!loading && filtrados.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                {busqueda ? 'No se encontraron resultados.' : 'No hay documentos disponibles.'}
              </div>
            )}

            <IonList lines="full" style={{ padding: 0 }}>
              {filtrados.map((doc) => (
                <IonItem key={doc.id} button detail={false} style={{
                  '--padding-start': '24px', '--padding-end': '16px',
                  '--min-height': '58px', '--border-color': '#ebebeb',
                }}>
                  <IonLabel style={{ fontWeight: '500', color: '#2a2a2a', fontSize: '15px' }}>
                    {doc.descripcion ?? doc.codigo ?? `Documento ${doc.id}`}
                  </IonLabel>
                  <IonIcon
                    slot="end"
                    icon={reorderThreeOutline}
                    style={{ color: '#aaa', fontSize: '22px', cursor: 'pointer' }}
                    onClick={(e) => abrirMenu(e as any, doc.id)}
                  />
                </IonItem>
              ))}
            </IonList>
          </div>
        </div>

        {/* ── MENÚ CONTEXTUAL ── */}
        <IonPopover
          isOpen={popoverOpen}
          event={popoverEvent}
          onDidDismiss={() => setPopoverOpen(false)}
          showBackdrop={false}
          style={{ '--width': '220px', '--border-radius': '14px', '--box-shadow': '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <IonList lines="full" style={{ padding: '4px 0' }}>
            <IonItem button detail={false}
              onClick={() => {
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

export default ListaArchivoAmpliada;