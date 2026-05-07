import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AppNuevaSolicitud: React.FC = () => {
  const history = useHistory();
  
  // Estados para manejar el Loading (spinner) y el Toast (mensaje de éxito)
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Mostramos el spinner para bloquear el botón y evitar doble envío
    setShowLoading(true);

    // 2. Simulamos el tiempo de respuesta del servidor (2 segundos)
    setTimeout(() => {
      setShowLoading(false); // Ocultamos el spinner
      setShowToast(true);    // Mostramos el mensaje de éxito
      
      // 3. Redirigimos al historial de solicitudes después de un momento
      setTimeout(() => {
        history.push('/app/solicitudes');
      }, 1500);
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f69b4', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/solicitudes" text="Cancelar" style={{ color: '#ffffff' }} />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold' }}>
              Ingresar Requerimiento
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h5 style={{ fontFamily: "'Roboto Slab', serif", color: '#333', marginBottom: '20px' }}>
                    Detalle de la Solicitud
                  </h5>
                  <p className="text-muted small mb-4">
                    Complete los datos para solicitar información financiera o de gestión a la Municipalidad de Santo Domingo.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Categoría de la Información</label>
                      <select className="form-control" required defaultValue="">
                        <option value="" disabled>Seleccione una categoría...</option>
                        <option value="finanzas">Transparencia Financiera (Presupuestos)</option>
                        <option value="obras">Obras y Urbanismo</option>
                        <option value="educacion">Educación Pública</option>
                        <option value="salud">Salud Municipal</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Asunto</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: Ejecución presupuestaria Q1 2026" 
                        required 
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label font-weight-bold">Descripción detallada</label>
                      <textarea 
                        className="form-control" 
                        rows={5} 
                        placeholder="Especifique qué datos necesita, periodos a comparar o formatos preferidos..."
                        required
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 shadow-sm"
                      style={{ backgroundColor: '#0f69b4', borderColor: '#0f69b4' }}
                      disabled={showLoading}
                    >
                      {showLoading ? 'Procesando...' : 'Enviar Solicitud'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Componente nativo para evitar duplicidad de envíos */}
        <IonLoading
          isOpen={showLoading}
          message={'Registrando solicitud en el sistema...'}
          spinner="crescent"
        />

        {/* Componente nativo para feedback visual de éxito */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Solicitud ingresada correctamente. Folio #45192."
          duration={2000}
          color="success"
        />

      </IonContent>
    </IonPage>
  );
};

export default AppNuevaSolicitud;