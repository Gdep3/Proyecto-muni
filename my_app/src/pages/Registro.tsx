import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/api';

const Registro: React.FC = () => {
  const history = useHistory();
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [exito, setExito]     = useState(false);

  const [form, setForm] = useState({
    nombre: '', rut: '', email: '',
    region: '', comuna: '', password: '', confirmar: '',
  });
  
    const validar = () => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio';
    if (!/^\d{7,8}-[\dkK]$/.test(form.rut.replace(/\./g, '')))
      return 'RUT inválido. Formato: 12345678-9';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Email inválido';
    if (form.password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres';
    if (form.password !== form.confirmar)
      return 'Las contraseñas no coinciden';
    return null;
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) { setError(errorValidacion); return; }

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nombre:   form.nombre,
        rut:      form.rut,
        email:    form.email,
        region:   form.region,
        comuna:   form.comuna,
        password: form.password,
      });
      setExito(true);
      setTimeout(() => history.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container" style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <div className="card-body p-4">

              <IonButton onClick={() => history.push('/login')} shape="round" fill="clear"
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
                    <input type="text" name="nombre" className="form-control"
                      placeholder="Ej: Ana López" required
                      value={form.nombre} onChange={handleChange}
                      style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">RUT</label>
                    <input type="text" name="rut" className="form-control"
                      placeholder="12.345.678-9" required
                      value={form.rut} onChange={handleChange}
                      style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small font-weight-bold">Correo Electrónico</label>
                  <input type="email" name="email" className="form-control"
                    placeholder="correo@ejemplo.cl" required
                    value={form.email} onChange={handleChange}
                    style={{ borderRadius: '8px' }} />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Región</label>
                    <select name="region" className="form-control" required
                      value={form.region} onChange={handleChange}
                      style={{ borderRadius: '8px' }}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="valparaiso">Región de Valparaíso</option>
                      <option value="metropolitana">Región Metropolitana</option>
                    </select>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Comuna</label>
                    <select name="comuna" className="form-control" required
                      value={form.comuna} onChange={handleChange}
                      style={{ borderRadius: '8px' }}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="santo_domingo">Santo Domingo</option>
                      <option value="san_antonio">San Antonio</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Contraseña</label>
                    <input type="password" name="password" className="form-control"
                      placeholder="••••••••" required
                      value={form.password} onChange={handleChange}
                      style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small font-weight-bold">Confirmar Contraseña</label>
                    <input type="password" name="confirmar" className="form-control"
                      placeholder="••••••••" required
                      value={form.confirmar} onChange={handleChange}
                      style={{ borderRadius: '8px' }} />
                  </div>
                </div>

                <div className="form-check mb-4 p-3 bg-light rounded" style={{ paddingLeft: '2.5rem' }}>
                  <input className="form-check-input" type="checkbox" id="terminos" required
                    onChange={e => setTerminosAceptados(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="terminos">
                    Declaro que la información ingresada es verídica y acepto las políticas de uso de la Plataforma de Acceso a la Información.
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100"
                  disabled={!terminosAceptados || loading}
                  style={{
                    backgroundColor: terminosAceptados ? '#006FB3' : '#aab4be',
                    border: 'none', borderRadius: '8px', padding: '10px', fontWeight: '600',
                  }}>
                  {loading ? 'Registrando...' : 'Registrar Cuenta'}
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