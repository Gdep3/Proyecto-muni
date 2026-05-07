import React from 'react';
import { 
  IonPage, 
  IonContent 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación: Redirige al panel del ciudadano según la arquitectura
    history.push('/app/inicio'); 
  };

  return (
    <IonPage>
      {/* Fondo gris claro para resaltar la tarjeta blanca */}
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container" style={{ marginTop: '10vh' }}>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              
              <div className="card shadow-lg border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h4 style={{ fontFamily: "'Roboto Slab', serif", color: '#0f69b4', fontWeight: 'bold' }}>
                      Municipalidad de Santo Domingo
                    </h4>
                    <p className="text-muted" style={{ fontFamily: "'Roboto', sans-serif" }}>
                      Plataforma de Acceso a la Información
                    </p>
                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold">RUT de Usuario</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        placeholder="Ej: 12.345.678-9" 
                        required 
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label font-weight-bold">Contraseña</label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="recordarme" />
                        <label className="form-check-label text-muted" htmlFor="recordarme">Recordarme</label>
                      </div>
                      <a href="#" style={{ color: '#0f69b4', fontSize: '0.9rem', textDecoration: 'none' }}>
                        ¿Olvidó su clave?
                      </a>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 shadow-sm"
                      style={{ backgroundColor: '#0f69b4', borderColor: '#0f69b4', borderRadius: '8px' }}
                    >
                      Iniciar Sesión
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-4 border-top">
                    <p className="mb-0" style={{ fontFamily: "'Roboto', sans-serif" }}>
                      ¿No tiene una cuenta? <br/>
                      <a href="/registro" style={{ color: '#0f69b4', fontWeight: 'bold', textDecoration: 'none' }}>
                        Regístrese en el Portal
                      </a>
                    </p>
                  </div>

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