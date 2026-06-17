import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonSpinner,
  IonIcon,
  IonToast
} from '@ionic/react';
import { shieldCheckmarkOutline, personOutline, arrowBackOutline } from 'ionicons/icons';
import { usuariosService } from '../services/api';

interface Usuario {
  rut: string;
  nombre: string;
  email: string;
  rol: string;
}

const AdminUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Función para ir a buscar todos los usuarios al backend
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const data = await usuariosService.listar();
      // Si el backend devuelve la lista dentro de un objeto, ajustamos aquí. 
      // Asumimos que devuelve un array directamente.
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setMensaje('Error al cargar la lista de usuarios. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta automáticamente al entrar a la página
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función que usa nuestra ruta segura para cambiar roles
  const handleCambiarRol = async (rutUsuario: string, nuevoRol: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      const payload = { rol: nuevoRol.toLowerCase() };
      
      const response = await fetch(`http://localhost:8000/usuarios/${rutUsuario}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🚨 Error:", errorData);
        throw new Error('El servidor rechazó el cambio');
      }

      setUsuarios(usuariosActuales => 
        usuariosActuales.map(u => 
          u.rut === rutUsuario ? { ...u, rol: nuevoRol.toLowerCase() } : u
        )
      );

      console.log("¡Rol actualizado con éxito!");
      
    } catch (error) {
      console.error("Falla en la petición:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white' }}>
          <IonButton 
            style={{ color: 'white', '--padding-start': '0', '--padding-end': '8px' }} 
            onClick={() => window.history.back()}
        >
          <IonIcon slot="icon-only" icon={arrowBackOutline} style={{ fontSize: '24px' }} />
          </IonButton>
          <IonTitle style={{ fontWeight: 'bold' }}>Gestión de Usuarios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' }}>
        
        <div style={{ padding: '10px 0 20px 0' }}>
          <h2 style={{ color: '#15305b', fontWeight: 'bold', margin: '0', fontSize: '22px' }}>
            Administrar Cuentas
          </h2>
          <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
            Aquí puedes ver a todos los registrados y otorgar permisos de administrador.
          </p>
        </div>

        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" style={{ color: '#1a9cd8' }} />
          </div>
        ) : (
          <IonList style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', padding: 0 }}>
            {usuarios.length === 0 ? (
              <IonItem lines="none">
                <IonLabel className="ion-text-center" style={{ padding: '30px 0', color: '#888' }}>
                  No hay usuarios registrados aún.
                </IonLabel>
              </IonItem>
            ) : (
              usuarios.map((user) => (
                <IonItem key={user.rut} lines="full" style={{ '--padding-top': '10px', '--padding-bottom': '10px' }}>
                  <IonIcon 
                    icon={user.rol === 'admin' ? shieldCheckmarkOutline : personOutline} 
                    slot="start" 
                    style={{ 
                      color: user.rol === 'admin' ? '#1a9cd8' : '#888', 
                      fontSize: '28px',
                      backgroundColor: user.rol === 'admin' ? 'rgba(26, 156, 216, 0.1)' : 'rgba(0,0,0,0.05)',
                      padding: '8px',
                      borderRadius: '50%'
                    }} 
                  />
                  <IonLabel>
                    <h3 style={{ fontWeight: 'bold', color: '#333', fontSize: '16px', marginBottom: '4px' }}>
                      {user.nombre || 'Usuario Registrado'}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '13px' }}>RUT: <strong>{user.rut}</strong></p>
                    <p style={{ margin: '0', color: '#666', fontSize: '13px' }}>Email: {user.email || 'Sin correo'}</p>
                  </IonLabel>
                  
                  <div slot="end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <IonBadge 
                      style={{ 
                        backgroundColor: user.rol === 'admin' ? '#15305b' : '#e0e0e0',
                        color: user.rol === 'admin' ? 'white' : '#666',
                        padding: '6px 10px',
                        borderRadius: '10px'
                      }}
                    >
                      {user.rol.toUpperCase()}
                    </IonBadge>
                    
                    <IonButton 
                      size="small" 
                      fill="outline" 
                      onClick={() => handleCambiarRol(user.rut, user.rol === 'admin' ? 'ciudadano' : 'admin')}
                      style={{
                        '--color': user.rol === 'admin' ? '#dc3545' : '#28a745',
                        '--border-color': user.rol === 'admin' ? '#dc3545' : '#28a745',
                        '--border-radius': '8px',
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      {user.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                    </IonButton>
                  </div>
                </IonItem>
              ))
            )}
          </IonList>
        )}

        {/* Notificación flotante para avisar que el rol se cambió con éxito */}
        <IonToast
          isOpen={mensaje !== ''}
          onDidDismiss={() => setMensaje('')}
          message={mensaje}
          duration={3000}
          position="bottom"
          style={{ '--background': '#333', '--color': 'white', fontWeight: 'bold' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuario;