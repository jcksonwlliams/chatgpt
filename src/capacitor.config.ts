import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.surgipho.app',
  appName: 'SurgiPho',
  webDir: 'dist',
  server: {
    iosScheme: 'https'
  }
};

export default config;
