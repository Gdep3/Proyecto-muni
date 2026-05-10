import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Registro: React.FC = () => {
  const history = useHistory();
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container" style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <div className="card-body p-4">

              {/* Botón cerrar */}
              <IonButton
                onClick={() => history.push('/')}
                shape="round"
                fill="clear"
                style={{ position: 'absolute', top: '5px', right: '5px', width: '30px', height: '30px', background: 'none', border: 'none' }}
              >
                <IonIcon slot="icon-only" icon={closeOutline} color="dark" />
              </IonButton>

              <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#15305b' }}>Crear Cuenta</h5>
              <p className="text-muted small mb-4">Municipalidad de Santo Domingo</p>

              <form onSubmit={handleSubmit}>

                {/* Nombre y RUT */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Nombre Completo</label>
                    <input type="text" className="form-control" placeholder="Ej: Ana López" required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">RUT</label>
                    <input type="text" className="form-control" placeholder="12.345.678-9" required style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small font-weight-bold">Correo Electrónico</label>
                  <input type="email" className="form-control" placeholder="correo@ejemplo.cl" required style={{ borderRadius: '8px' }} />
                </div>

                {/* Región y Comuna */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Región</label>
                    <select className="form-control" required defaultValue="" style={{ borderRadius: '8px' }}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="valparaiso">Región de Valparaíso</option>
                      <option value="metropolitana">Región Metropolitana</option>
                    </select>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Comuna</label>
                    <select className="form-control" required defaultValue="" style={{ borderRadius: '8px' }}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="santo_domingo">Santo Domingo</option>
                      <option value="san_antonio">San Antonio</option>
                    </select>
                  </div>
                </div>

                {/* Contraseñas */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Contraseña</label>
                    <input type="password" className="form-control" placeholder="••••••••" required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Confirmar Contraseña</label>
                    <input type="password" className="form-control" placeholder="••••••••" required style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                {/* Términos */}
                <div className="form-check mb-4 p-3 bg-light rounded" style={{ paddingLeft: '2.5rem' }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terminos"
                    required
                    onChange={e => setTerminosAceptados(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="terminos">
                    Declaro que la información ingresada es verídica y acepto las políticas de uso de la Plataforma de Acceso a la Información.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!terminosAceptados}
                  style={{
                    backgroundColor: terminosAceptados ? '#006FB3' : '#aab4be',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: '600',
                  }}
                >
                  Registrar Cuenta
                </button>

                <div className="text-center mt-3">
                  <span
                    className="small text-muted"
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => history.push('/login')}
                  >
                    ¿Ya tienes cuenta? Iniciar sesión
                  </span>
                </div>

              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;