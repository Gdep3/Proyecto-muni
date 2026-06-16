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
import { shieldCheckmarkOutline, personOutline } from 'ionicons/icons';
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

  const cambiarRol = async (rut: string, rolActual: string) => {
    const nuevoRol = rolActual === 'admin' ? 'ciudadano' : 'admin';
    try {
      await usuariosService.cambiarRol(rut, nuevoRol);
      cargar();
    } catch {
      alert('Error al cambiar el rol');
    }
  };

  const eliminar = async (rut: string, nombre: string) => {
    if (!confirm(`¿Eliminar al usuario ${nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await usuariosService.eliminar(rut);
      cargar();
    } catch {
      alert('Error al eliminar el usuario');
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#15305b', '--color': 'white' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/dashboard" style={{ color: 'white' }} />
          </IonButtons>
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
          <IonButton color="light" onClick={() => history.push('/admin/perfil')} style={{
            width: '48px', height: '48px', '--border-radius': '50%',
            '--padding-start': '0', '--padding-end': '0', marginTop: '6px',
          }}>
            <IonIcon icon={personOutline} style={{ color: '#15305b', fontSize: '22px' }} />
          </IonButton>
        </div>

        <div style={{ marginTop: '-70px', padding: '0 24px 40px 24px' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                Usuarios Registrados {!loading && `(${usuarios.length})`}
              </h3>
            </div>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <IonSpinner name="crescent" style={{ color: '#15305b' }} />
              </div>
            )}
            {error && (
              <div style={{ padding: '20px', color: '#842029', backgroundColor: '#f8d7da' }}>{error}</div>
            )}
            {!loading && !error && usuarios.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No hay usuarios.</div>
            )}

            {usuarios.map((u, i) => {
              const rc = rolColor[u.rol] ?? { bg: '#e9ecef', color: '#495057' };
              return (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px',
                  borderBottom: i < usuarios.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IonIcon icon={personCircleOutline} style={{ color: '#15305b', fontSize: '28px' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{u.nombre}</p>
                    <p style={{ margin: '2px 0 0', color: '#888', fontSize: '12px' }}>{u.rut} · {u.email}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: rc.bg, color: rc.color, flexShrink: 0,
                  }}>
                    {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                  </span>

                  {/* Botón cambiar rol */}
                  <button
                    onClick={() => cambiarRol(u.rut, u.rol)}
                    title={u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                    style={{
                      padding: '6px 10px', borderRadius: '8px', border: '1px solid #d5d5d5',
                      backgroundColor: 'white', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <IonIcon icon={shieldOutline} style={{ color: '#15305b', fontSize: '16px' }} />
                  </button>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => eliminar(u.rut, u.nombre)}
                    title="Eliminar usuario"
                    style={{
                      padding: '6px 10px', borderRadius: '8px', border: '1px solid #f8d7da',
                      backgroundColor: '#fff5f5', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <IonIcon icon={trashOutline} style={{ color: '#e74c3c', fontSize: '16px' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuario;