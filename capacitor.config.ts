import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.surgipho.app',
  appName: 'Surgipho',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    scheme: 'Surgipho',
    allowsLinkPreview: true,
    scrollEnabled: true,
    hideLogs: false,
    allowNavigation: ['*']
  }
};

export default config;