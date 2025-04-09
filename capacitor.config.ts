
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8d55666906cd46648104d2c7cd97ece2',
  appName: 'invenx-scan-track-flow',
  webDir: 'dist',
  server: {
    url: 'https://8d556669-06cd-4664-8104-d2c7cd97ece2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorCommunityBarcodeScanner: {
      cameraDirection: 'back'
    }
  }
};

export default config;
