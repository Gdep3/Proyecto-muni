import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IonIcon } from '@ionic/react';
import { accessibilityOutline, closeOutline, refreshOutline } from 'ionicons/icons';
import { useAccesibilidad, ModoColor } from '../hooks/useAccesibilidad';

/* ── Filtro SVG para daltonismo — se inyecta en body una vez ── */
if (!document.getElementById('acc-svg-filters')) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'acc-svg-filters';
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  svg.innerHTML = `<defs>
    <filter id="daltonico-filter">
      <feColorMatrix type="matrix" values="
        0.625 0.375 0   0 0
        0.7   0.3   0   0 0
        0     0.3   0.7 0 0
        0     0     0   1 0
      "/>
    </filter>
  </defs>`;
  document.body.appendChild(svg);
}

/* ── Panel (via Portal, renderizado directo en body) ── */
const Panel = React.forwardRef<HTMLDivElement, {
  config: any;
  modos: any[];
  porcentajeFuente: number;
  onAumentar: () => void;
  onDisminuir: () => void;
  onCambiarModo: (k: ModoColor) => void;
  onResetear: () => void;
}>(({ config, modos, porcentajeFuente, onAumentar, onDisminuir, onCambiarModo, onResetear }, ref) => {

  // Todos los estilos son valores absolutos — no heredan nada
  const s = {
    panel: {
      position: 'fixed' as const,
      bottom: '90px', right: '20px',
      zIndex: 2147483647,
      width: '260px',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      // Colores completamente explícitos — inmunes a filtros externos
      backgroundColor: '#ffffff',
      color: '#333333',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      // Neutralizar cualquier filtro heredado del padre
      filter: 'none',
      isolation: 'isolate' as const,
    },
    titulo: { fontWeight: 700, color: '#15305b', fontSize: '14px' },
    label: { margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#555555', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    separador: { height: '1px', backgroundColor: '#f0f0f0', margin: '16px 0' },
    btnFuente: (dis: boolean): React.CSSProperties => ({
      width: '36px', height: '36px', borderRadius: '8px',
      border: '1px solid #dddddd',
      backgroundColor: dis ? '#f5f5f5' : '#ffffff',
      color: '#333333', fontSize: '16px', fontWeight: 'bold',
      cursor: dis ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      filter: 'none',
    }),
    btnModo: (activo: boolean): React.CSSProperties => ({
      width: '100%', padding: '10px 12px', borderRadius: '10px',
      border: `1.5px solid ${activo ? '#15305b' : '#e0e0e0'}`,
      backgroundColor: activo ? '#e8f0fe' : '#ffffff',
      color: '#333333', cursor: 'pointer', marginBottom: '8px',
      display: 'flex', alignItems: 'center', gap: '10px',
      textAlign: 'left', filter: 'none',
    }),
  };

  return ReactDOM.createPortal(
    <div ref={ref} style={s.panel}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={s.titulo}>♿ Accesibilidad</span>
        <button onClick={onResetear}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', filter: 'none' }}>
          <IonIcon icon={refreshOutline} style={{ fontSize: '14px', color: '#888888' }} />
          <span style={{ color: '#888888' }}>Restablecer</span>
        </button>
      </div>

      {/* Tamaño de fuente */}
      <p style={s.label}>Tamaño de letra</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <button onClick={onDisminuir} disabled={config.tamanoFuente <= 0.85} style={s.btnFuente(config.tamanoFuente <= 0.85)}>
          <span style={{ color: '#333333' }}>A−</span>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#15305b' }}>
          {porcentajeFuente}%
        </div>
        <button onClick={onAumentar} disabled={config.tamanoFuente >= 1.3} style={s.btnFuente(config.tamanoFuente >= 1.3)}>
          <span style={{ color: '#333333' }}>A+</span>
        </button>
      </div>
      <div style={{ height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '2px', backgroundColor: '#1a9cd8',
          width: `${((config.tamanoFuente - 0.85) / (1.3 - 0.85)) * 100}%`,
          transition: 'width 0.2s ease',
        }} />
      </div>

      <div style={s.separador} />

      {/* Modos de color */}
      <p style={s.label}>Modo de color</p>
      {modos.map(({ key, label, descripcion, icono }: any) => {
        const activo = config.modoColor === key;
        return (
          <button key={key} onClick={() => onCambiarModo(key)} style={s.btnModo(activo)}>
            <span style={{ fontSize: '20px', filter: 'none' }}>{icono}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: activo ? '#15305b' : '#333333' }}>{label}</div>
              <div style={{ fontSize: '11px', color: '#888888' }}>{descripcion}</div>
            </div>
            {activo && <span style={{ marginLeft: 'auto', color: '#15305b', fontSize: '16px' }}>✓</span>}
          </button>
        );
      })}

    </div>,
    document.body
  );
});

/* ── Componente principal ── */
const BotonAccesibilidad: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const { config, aumentarFuente, disminuirFuente, cambiarModoColor, resetear } = useAccesibilidad();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [abierto]);

  const modos = [
    { key: 'alto-contraste' as ModoColor, label: 'Alto Contraste', descripcion: 'Fondo oscuro, texto claro', icono: '◑' },
    { key: 'daltonico'      as ModoColor, label: 'Daltónico',      descripcion: 'Paleta apta para daltonismo', icono: '◎' },
  ];

  return (
    <>
      {abierto && (
        <Panel
          ref={panelRef}
          config={config}
          modos={modos}
          porcentajeFuente={Math.round(config.tamanoFuente * 100)}
          onAumentar={aumentarFuente}
          onDisminuir={disminuirFuente}
          onCambiarModo={cambiarModoColor}
          onResetear={resetear}
        />
      )}

      {/* Botón flotante — también en portal para evitar filtros */}
      {ReactDOM.createPortal(
        <button
          onClick={() => setAbierto(o => !o)}
          title="Opciones de accesibilidad"
          style={{
            position: 'fixed', bottom: '24px', right: '20px',
            zIndex: 2147483647,
            width: '52px', height: '52px', borderRadius: '50%',
            backgroundColor: abierto ? '#15305b' : '#1a9cd8',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            transform: abierto ? 'scale(1.1)' : 'scale(1)',
            filter: 'none',
          }}
        >
          <IonIcon
            icon={abierto ? closeOutline : accessibilityOutline}
            style={{ color: '#ffffff', fontSize: '26px' }}
          />
        </button>,
        document.body
      )}
    </>
  );
};

export default BotonAccesibilidad;