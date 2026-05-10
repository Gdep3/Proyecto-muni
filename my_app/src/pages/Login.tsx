import React from 'react';
import { 
  IonPage, 
  IonContent,
  IonIcon,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { closeOutline } from 'ionicons/icons';

interface LoginProps {
  onLogin?: (role: 'ciudadano' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  onLogin?.('admin');
  history.push('/redirect');
  };

  return (
    <IonPage>
        <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
          <div className="container" style={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px', maxWidth: '400px', width: '100%', position: 'relative' }}>
              <div className="card-body p-4">
                <IonButton onClick={() => history.push('/')} shape='round' fill={'clear'} style={{ position: 'absolute', top: '5px', right: '5px',hight: '30', width:'30' , background: 'none', border: 'none' }}><IonIcon slot='icon-only' icon={closeOutline} color='dark'/></IonButton>
                
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold">Rut</label>
                    <input type="text" className="form-control" placeholder="12221457-8" style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold">Contraseña</label>
                    <input type="password" className="form-control" placeholder="contraseña" style={{ borderRadius: '8px' }} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: '##006FB3', border: 'none', borderRadius: '8px', padding: '10px' }}>
                    Iniciar Sesión
                  </button>
                  <div className="text-center mt-3">
                    <a href="#" className="small text-muted" style={{ textDecoration: 'underline' }}>¿Olvidaste la contraseña?</a>
                  </div>
                </form>
                {/* Accesos rápidos de prueba */}
                <div className="mt-3">
                  <p className="text-muted small text-center mb-2">— Acceso rápido (solo pruebas) —</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                      style={{ borderRadius: '8px', fontSize: '13px' }}
                      // Ciudadano
                      onClick={() => { onLogin?.('ciudadano'); history.push('/app/inicio'); }}
                    >
                      Entrar como Ciudadano
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      style={{ borderRadius: '8px', fontSize: '13px' }}
                      // Admin
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