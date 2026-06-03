import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { closeOutline } from 'ionicons/icons';
import { authService } from '../services/api'; 

interface LoginProps {
  onLogin?: (role: 'ciudadano' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const history = useHistory();
  
  // Estados limpios y sin duplicados
  const [rut, setRut] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const data = await authService.login(rut, contrasena);

      if (data.success) {
        onLogin?.(data.role as 'ciudadano' | 'admin');
        
        if (data.role === 'admin') {
          history.push('/admin/dashboard');
        } else {
          history.push('/app/inicio');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'RUT o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
        <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
          <div className="container" style={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '400px', width: '100%', position: 'relative' }}>
              <div className="card-body p-4">
                <IonButton onClick={() => history.push('/')} shape='round' fill={'clear'} style={{ position: 'absolute', top: '5px', right: '5px', height: '30px', width:'30px', background: 'none', border: 'none' }}>
                  <IonIcon slot='icon-only' icon={closeOutline} color='dark'/>
                </IonButton>
                
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold">RUT</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="12221457-8" 
                      style={{ borderRadius: '8px' }} 
                      value={rut}
                      onChange={(e) => setRut(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Tu contraseña" 
                      style={{ borderRadius: '8px' }} 
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)} 
                      required
                    />
                  </div>

                  {errorMsg && <p className="text-danger small text-center mb-2">{errorMsg}</p>}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    style={{ backgroundColor: '#006FB3', border: 'none', borderRadius: '8px', padding: '10px' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
                  </button>
                  
                  <div className="text-center mt-3">
                    <a href="#" className="small text-muted" style={{ textDecoration: 'underline' }}>¿Olvidaste la contraseña?</a>
                  </div>
                </form>
                
                <div className="mt-3">
                  <p className="text-muted small text-center mb-2">— Acceso rápido (solo pruebas) —</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                      style={{ borderRadius: '8px', fontSize: '13px' }}
                      onClick={() => { onLogin?.('ciudadano'); history.push('/app/inicio'); }}
                    >
                      Entrar como Ciudadano
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      style={{ borderRadius: '8px', fontSize: '13px' }}
                      onClick={() => { onLogin?.('admin'); history.push('/admin/dashboard'); }}
                    >
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