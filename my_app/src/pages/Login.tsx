import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/api';

interface LoginProps {
  onLogin?: (role: 'ciudadano' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const history = useHistory();
  const [rut, setRut]           = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rut.trim() || !password.trim()) {
      setError('Ingresa tu RUT y contraseña');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await authService.login(rut, password);
      onLogin?.(data.rol);
      history.push(data.rol === 'admin' ? '/admin/dashboard' : '/app/inicio');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'RUT o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const accesoDirecto = async (rol: 'ciudadano' | 'admin') => {
    onLogin?.(rol);
    history.push(rol === 'admin' ? '/admin/dashboard' : '/app/inicio');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container" style={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <div className="card-body p-4">

              <IonButton onClick={() => history.push('/')} shape="round" fill="clear"
                style={{ position: 'absolute', top: '5px', right: '5px', width: '30px', height: '30px' }}>
                <IonIcon slot="icon-only" icon={closeOutline} color="dark" />
              </IonButton>

              <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#15305b' }}>Iniciar Sesión</h5>
              <p className="text-muted small mb-4">Municipalidad de Santo Domingo</p>

              {error && (
                <div className="alert alert-danger py-2 small" style={{ borderRadius: '8px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small font-weight-bold">RUT</label>
                  <input type="text" className="form-control" placeholder="12.345.678-9"
                    value={rut} onChange={e => setRut(e.target.value)}
                    required style={{ borderRadius: '8px' }} />
                </div>
                <div className="mb-3">
                  <label className="form-label small font-weight-bold">Contraseña</label>
                  <input type="password" className="form-control" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    required style={{ borderRadius: '8px' }} />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}
                  style={{ backgroundColor: '#006FB3', border: 'none', borderRadius: '8px', padding: '10px' }}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <div className="text-center mt-3">
                  <span className="small text-muted" style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => history.push('/registro')}>
                    ¿No tienes cuenta? Regístrate
                  </span>
                </div>
              </form>

              <div className="mt-3">
                <p className="text-muted small text-center mb-2">— Acceso rápido (solo pruebas) —</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-outline-primary w-100"
                    style={{ borderRadius: '8px', fontSize: '13px' }}
                    onClick={() => accesoDirecto('ciudadano')}>
                    Entrar como Ciudadano
                  </button>
                  <button type="button" className="btn btn-outline-danger w-100"
                    style={{ borderRadius: '8px', fontSize: '13px' }}
                    onClick={() => accesoDirecto('admin')}>
                    Entrar como Admin
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;