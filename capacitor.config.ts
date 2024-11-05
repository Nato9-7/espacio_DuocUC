import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'espaciosDuocUC',
  webDir: 'www',
  plugins: {
    BarcodeScanner: {
      android: {
        useCamera2: true, // Habilitar el uso de Camera2 para Android
      },
    },
  },
};

export default config;
