import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { accessibilityOutline, closeOutline, refreshOutline } from 'ionicons/icons';
import { useAccesibilidad, ModoColor } from '../hooks/useAccesibilidad';

const BotonAccesibilidad: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const { config, aumentarFuente, disminuirFuente, cambiarModoColor, resetear } = useAccesibilidad();

  const modos: { key: ModoColor; label: string; descripcion: string; icono: string }[] = [
    { key: 'alto-contraste', label: 'Alto Contraste', descripcion: 'Fondo oscuro, texto blanco', icono: '◑' },
    { key: 'daltonico',      label: 'Daltónico',      descripcion: 'Paleta apta para daltonismo', icono: '◎' },
  ];

  const porcentajeFuente = Math.round(config.tamanoFuente * 100);

  return (
    <>
      {/* CSS global para los modos — se inyecta una sola vez */}
      <style>{`
        /* ── Alto Contraste ── */
        html.acc-alto-contraste {
          filter: none;
        }
        html.acc-alto-contraste body,
        html.acc-alto-contraste ion-app,
        html.acc-alto-contraste ion-content,
        html.acc-alto-contraste ion-page {
          --background: #000000 !important;
          --color: #ffffff !important;
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        html.acc-alto-contraste ion-card,
        html.acc-alto-contraste div[style] {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }
        html.acc-alto-contraste p,
        html.acc-alto-contraste span,
        html.acc-alto-contraste h1,
        html.acc-alto-contraste h2,
        html.acc-alto-contraste h3,
        html.acc-alto-contraste label {
          color: #ffffff !important;
        }
        html.acc-alto-contraste ion-item {
          --background: #1a1a1a !important;
          --color: #ffffff !important;
          --border-color: #444 !important;
        }
        html.acc-alto-contraste ion-toolbar {
          --background: #000000 !important;
          --color: #ffff00 !important;
        }
        html.acc-alto-contraste a {
          color: #ffff00 !important;
        }
        html.acc-alto-contraste ion-button::part(native) {
          background: #ffff00 !important;
          color: #000000 !important;
        }

        /* ── Daltónico (deuteranopía) ── */
        html.acc-daltonico {
          filter: url('#daltonico-filter');
        }

        /* ── Transición suave al cambiar modo ── */
        html {
          transition: font-size 0.2s ease;
        }
      `}</style>

      {/* Filtro SVG para daltonismo — invisible pero necesario */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="daltonico-filter">
            <feColorMatrix type="matrix" values="
              0.625 0.375 0     0 0
              0.7   0.3   0     0 0
              0     0.3   0.7   0 0
              0     0     0     1 0
            "/>
          </filter>
        </defs>
      </svg>

      {/* ── Panel de opciones ── */}
      {abierto && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            onClick={() => setAbierto(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
          />

          <div style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '20px',
            width: '260px',
            border: '1px solid #e0e0e0',
          }}>

            {/* Header del panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', color: '#15305b', fontSize: '14px' }}>
                ♿ Accesibilidad
              </span>
              <button onClick={resetear} title="Restablecer todo"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IonIcon icon={refreshOutline} style={{ fontSize: '14px' }} />
                Restablecer
              </button>
            </div>

            {/* Tamaño de fuente */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tamaño de letra
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={disminuirFuente}
                  disabled={config.tamanoFuente <= 0.85}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    border: '1px solid #ddd', backgroundColor: config.tamanoFuente <= 0.85 ? '#f5f5f5' : 'white',
                    cursor: config.tamanoFuente <= 0.85 ? 'not-allowed' : 'pointer',
                    fontSize: '18px', fontWeight: 'bold', color: '#333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >A−</button>

                <div style={{
                  flex: 1, textAlign: 'center', fontSize: '13px',
                  fontWeight: '600', color: '#15305b',
                }}>
                  {porcentajeFuente}%
                </div>

                <button
                  onClick={aumentarFuente}
                  disabled={config.tamanoFuente >= 1.3}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    border: '1px solid #ddd', backgroundColor: config.tamanoFuente >= 1.3 ? '#f5f5f5' : 'white',
                    cursor: config.tamanoFuente >= 1.3 ? 'not-allowed' : 'pointer',
                    fontSize: '18px', fontWeight: 'bold', color: '#333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >A+</button>
              </div>

              {/* Barra visual del tamaño */}
              <div style={{ height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '2px', backgroundColor: '#1a9cd8',
                  width: `${((config.tamanoFuente - 0.85) / (1.3 - 0.85)) * 100}%`,
                  transition: 'width 0.2s ease',
                }} />
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', backgroundColor: '#f0f0f0', marginBottom: '16px' }} />

            {/* Modos de color */}
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Modo de color
              </p>
              {modos.map(({ key, label, descripcion, icono }) => {
                const activo = config.modoColor === key;
                return (
                  <button
                    key={key}
                    onClick={() => cambiarModoColor(key)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px',
                      border: `1.5px solid ${activo ? '#15305b' : '#e0e0e0'}`,
                      backgroundColor: activo ? '#e8f0fe' : 'white',
                      cursor: 'pointer', marginBottom: '8px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{icono}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: activo ? '#15305b' : '#333' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{descripcion}</div>
                    </div>
                    {activo && (
                      <span style={{ marginLeft: 'auto', color: '#15305b', fontSize: '16px' }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </>
      )}

      {/* ── Botón flotante principal ── */}
      <button
        onClick={() => setAbierto(o => !o)}
        title="Opciones de accesibilidad"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          zIndex: 10000,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: abierto ? '#15305b' : '#1a9cd8',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          transition: 'background-color 0.2s ease, transform 0.2s ease',
          transform: abierto ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <IonIcon
          icon={abierto ? closeOutline : accessibilityOutline}
          style={{ color: 'white', fontSize: '26px' }}
        />
      </button>
    </>
  );
};

export default BotonAccesibilidad;