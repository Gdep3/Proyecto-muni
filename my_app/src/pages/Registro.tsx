import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/react';

const Registro: React.FC = () => {
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creación de cuenta solicitada...");
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff', '--color': '#333333' }}>
          <IonButtons slot="start">
            {/* Vuelve de manera natural al Login */}
            <IonBackButton defaultHref="/login" text="Volver" />
          </IonButtons>
          <div className="container mt-2 mb-2">
            <h5 style={{ fontFamily: "'Roboto Slab', serif", margin: 0, fontWeight: 'bold', color: '#0f69b4' }}>
              Municipalidad de Santo Domingo
            </h5>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f4f6f9' }}>
        <div className="container mt-4 mb-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-7">
              <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 p-md-5">
                  <h4 style={{ fontFamily: "'Roboto Slab', serif", color: '#333', marginBottom: '24px' }}>
                    Creación de Cuenta Ciudadana
                  </h4>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Nombre Completo</label>
                        <input type="text" className="form-control" placeholder="Ej: Ana López" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">RUT</label>
                        <input type="text" className="form-control" placeholder="12.345.678-9" required />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Correo Electrónico</label>
                      <input type="email" className="form-control" placeholder="correo@ejemplo.cl" required />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Región</label>
                        <select className="form-control" required defaultValue="">
                          <option value="" disabled>Seleccione...</option>
                          <option value="valparaiso">Región de Valparaíso</option>
                          <option value="metropolitana">Región Metropolitana</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Comuna</label>
                        <select className="form-control" required defaultValue="">
                          <option value="" disabled>Seleccione...</option>
                          <option value="santo_domingo">Santo Domingo</option>
                          <option value="san_antonio">San Antonio</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Contraseña</label>
                        <input type="password" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Confirmar Contraseña</label>
                        <input type="password" className="form-control" required />
                      </div>
                    </div>

                    <div className="form-check mb-4 mt-3 p-3 bg-light rounded">
                      <input 
                        className="form-check-input ml-1" 
                        type="checkbox" 
                        id="terminos" 
                        required 
                        onChange={(e) => setTerminosAceptados(e.target.checked)}
                      />
                      <label className="form-check-label ml-4" htmlFor="terminos" style={{ fontSize: '0.9rem' }}>
                        Declaro que la información ingresada es verídica y acepto las políticas de uso de la Plataforma de Acceso a la Información.
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className={`btn btn-lg w-100 shadow-sm ${terminosAceptados ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        backgroundColor: terminosAceptados ? '#0f69b4' : '#6c757d', 
                        borderColor: 'transparent',
                        borderRadius: '8px'
                      }}
                      disabled={!terminosAceptados}
                    >
                      Registrar Cuenta
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;