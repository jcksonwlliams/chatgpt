
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, ArrowLeft, Camera } from 'lucide-react';

interface TrayScannerProps {
  expectedSerial: string;
  onScanResult: (scannedSerial: string) => void;
  onCancel: () => void;
}

const TrayScanner = ({ expectedSerial, onScanResult, onCancel }: TrayScannerProps) => {
  const [manualSerial, setManualSerial] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Simulate QR scanning with demo serials
  const demoSerials = ['TR-2024-001', 'TR-2024-002', 'TR-2024-003', 'TR-2024-999'];

  const handleSimulatedScan = () => {
    setIsScanning(true);
    // Simulate camera scanning delay
    setTimeout(() => {
      // 70% chance of getting the correct serial, 30% chance of getting a random one
      const shouldMatch = Math.random() > 0.3;
      const scannedSerial = shouldMatch ? expectedSerial : demoSerials[Math.floor(Math.random() * demoSerials.length)];
      onScanResult(scannedSerial);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSerial.trim()) {
      onScanResult(manualSerial.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-semibold">Scan Tray</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 break-all">
            Expected Serial: <span className="font-mono font-semibold">{expectedSerial}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Camera Scanner Simulation */}
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 mb-4">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs sm:text-sm text-gray-600">Scanning QR code...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <QrCode className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">Position QR code within frame</p>
                </div>
              )}
            </div>
            <Button 
              onClick={handleSimulatedScan} 
              disabled={isScanning}
              className="w-full text-sm sm:text-base"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Start Camera Scan'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or enter manually</span>
            </div>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manual-serial" className="text-sm">Tray Serial Number</Label>
              <Input
                id="manual-serial"
                placeholder="Enter tray serial (e.g., TR-2024-001)"
                value={manualSerial}
                onChange={(e) => setManualSerial(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button type="submit" variant="outline" className="w-full text-sm sm:text-base">
              Submit Manual Entry
            </Button>
          </form>

          {/* Demo Helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Demo Mode</h4>
            <p className="text-xs text-blue-700 mb-2">
              Camera scan will randomly return a matching or non-matching serial.
            </p>
            <p className="text-xs text-blue-700 break-all">
              Try manual entry with: <span className="font-mono">{expectedSerial}</span> (match) or <span className="font-mono">TR-2024-999</span> (mismatch)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrayScanner;
