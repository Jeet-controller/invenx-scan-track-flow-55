
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const scanBarcode = async (): Promise<string> => {
  try {
    // Check camera permission
    const status = await BarcodeScanner.checkPermission({ force: true });
    
    if (!status.granted) {
      // User denied permission
      return Promise.reject('Permission denied');
    }

    // Make background transparent
    document.querySelector('body')?.classList.add('scanner-active');
    
    // Start scan
    const result = await BarcodeScanner.startScan();
    
    // Stop scan 
    BarcodeScanner.stopScan();
    
    // If the result has content
    if (result.hasContent) {
      return result.content;
    } else {
      return Promise.reject('No barcode detected');
    }
  } catch (error) {
    console.error('Scan error:', error);
    return Promise.reject(error);
  } finally {
    // Restore background
    document.querySelector('body')?.classList.remove('scanner-active');
  }
};

export const stopScanning = () => {
  BarcodeScanner.stopScan();
  document.querySelector('body')?.classList.remove('scanner-active');
};
