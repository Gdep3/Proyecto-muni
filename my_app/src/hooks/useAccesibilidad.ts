import { useState, useEffect } from 'react';

export type ModoColor = 'normal' | 'alto-contraste' | 'daltonico';

export interface ConfigAccesibilidad {
  tamanoFuente: number;
  modoColor: ModoColor;
}

const CLAVE      = 'accesibilidad_config';
const REINVERTIR = 'invert(1) hue-rotate(180deg)';

const valorDefecto: ConfigAccesibilidad = {
  tamanoFuente: 1,
  modoColor: 'normal',
};

// Inyecta CSS en <head> para alto contraste — más confiable que JS al recargar
const inyectarCSS = () => {
  if (document.getElementById('acc-hc-style')) return;
  const style = document.createElement('style');
  style.id = 'acc-hc-style';
  style.textContent = `
    /* Alto contraste: invierte ion-app completo */
    body.acc-hc ion-app {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Re-invierte cards para que queden con fondo blanco */
    body.acc-hc ion-app ion-card {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Re-invierte imágenes para que se vean normales */
    body.acc-hc ion-app img,
    body.acc-hc ion-app video {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Daltónico */
    body.acc-dt ion-app {
      filter: url(#daltonico-filter) !important;
    }
  `;
  document.head.appendChild(style);
};

const aplicarClases = (config: ConfigAccesibilidad) => {
  inyectarCSS();

  const body = document.body;
  body.classList.remove('acc-hc', 'acc-dt');

  if (config.modoColor === 'alto-contraste') {
    body.classList.add('acc-hc');
  } else if (config.modoColor === 'daltonico') {
    body.classList.add('acc-dt');
  }

  document.documentElement.style.fontSize = `${config.tamanoFuente * 16}px`;
};

export const useAccesibilidad = () => {
  const [config, setConfig] = useState<ConfigAccesibilidad>(() => {
    try {
      const g = localStorage.getItem(CLAVE);
      return g ? JSON.parse(g) : valorDefecto;
    } catch { return valorDefecto; }
  });

  // Aplica inmediatamente al montar (antes del primer render)
  // y cada vez que cambia config
  useEffect(() => {
    aplicarClases(config);
    localStorage.setItem(CLAVE, JSON.stringify(config));
  }, [config]);

  const aumentarFuente   = () => setConfig(c => ({ ...c, tamanoFuente: Math.min(c.tamanoFuente + 0.15, 1.3) }));
  const disminuirFuente  = () => setConfig(c => ({ ...c, tamanoFuente: Math.max(c.tamanoFuente - 0.15, 0.85) }));
  const cambiarModoColor = (modo: ModoColor) =>
    setConfig(c => ({ ...c, modoColor: c.modoColor === modo ? 'normal' : modo }));
  const resetear = () => setConfig(valorDefecto);

  return { config, aumentarFuente, disminuirFuente, cambiarModoColor, resetear };
};

// Aplicar config guardada INMEDIATAMENTE al cargar el script
// antes de que React monte cualquier componente
(() => {
  try {
    const g = localStorage.getItem(CLAVE);
    if (g) {
      const config: ConfigAccesibilidad = JSON.parse(g);
      aplicarClases(config);
    }
  } catch {}
})();