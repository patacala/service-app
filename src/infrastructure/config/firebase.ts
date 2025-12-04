// Configuración centralizada de Firebase Auth (React Native Firebase).
// Al importar este módulo nos aseguramos de que la app nativa se configure
// leyendo GoogleService-Info.plist / google-services.json y creando la app [DEFAULT].
import '@react-native-firebase/app';
import authModule, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Re-exportamos los tipos para usarlos en el resto de la app sin acoplarla al paquete.
export type { FirebaseAuthTypes };

// Exportamos una referencia estable del módulo de auth.
// Siempre usaremos auth() para obtener la instancia por defecto.
export const auth = authModule;

export default authModule;