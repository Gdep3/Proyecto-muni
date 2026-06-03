import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/api';

const Registro: React.FC = () => {
  const history = useHistory();
  
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [exito, setExito] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (contrasena !== confirmarContrasena) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.register({
        rut,
        nombre,
        email: correo,
        password: contrasena,
        region,
        comuna
      });

      if (data.success) {
        alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
        history.push('/inicio');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container" style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <div className="card-body p-4">

              <IonButton onClick={() => history.push('/inicio')} shape="round" fill="clear"
                style={{ position: 'absolute', top: '5px', right: '5px', width: '30px', height: '30px' }}>
                <IonIcon slot="icon-only" icon={closeOutline} color="dark" />
              </IonButton>

              <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#15305b' }}>Crear Cuenta</h5>
              <p className="text-muted small mb-4">Municipalidad de Santo Domingo</p>

              {error && (
                <div className="alert alert-danger py-2 small" style={{ borderRadius: '8px' }}>
                  {error}
                </div>
              )}
              {exito && (
                <div className="alert alert-success py-2 small" style={{ borderRadius: '8px' }}>
                  ¡Cuenta creada! Redirigiendo al login...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Nombre Completo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ej: Ana López" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }} 
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">RUT</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="12.345.678-9" 
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }} 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small font-weight-bold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="correo@ejemplo.cl" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required 
                    style={{ borderRadius: '8px' }} 
                  />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Región</label>
                    <select 
                      className="form-control" 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="" disabled>Seleccione...</option>
                      <option value="valparaiso">Región de Valparaíso</option>
                      <option value="metropolitana">Región Metropolitana</option>
                    </select>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Comuna</label>
                    <select 
                      className="form-control" 
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="" disabled>Seleccione...</option>
                      <option value="santo_domingo">Santo Domingo</option>
                      <option value="san_antonio">San Antonio</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }} 
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={confirmarContrasena}
                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                      required 
                      style={{ borderRadius: '8px' }} 
                    />
                  </div>
                </div>

                {/* Mensaje de error visual */}
                {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

                {/* Términos */}
                <div className="form-check mb-4 p-3 bg-light rounded" style={{ paddingLeft: '2.5rem' }}>
                  <input className="form-check-input" type="checkbox" id="terminos" required
                    onChange={e => setTerminosAceptados(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="terminos">
                    Declaro que la información ingresada es verídica y acepto las políticas de uso de la Plataforma de Acceso a la Información.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!terminosAceptados || isLoading}
                  style={{
                    backgroundColor: terminosAceptados ? '#006FB3' : '#aab4be',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: '600',
                  }}
                >
                  {isLoading ? 'Registrando...' : 'Registrar Cuenta'}
                </button>

                <div className="text-center mt-3">
                  <span className="small text-muted" style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => history.push('/login')}>
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