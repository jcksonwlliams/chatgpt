
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, User, Package, Clock, CheckCircle, XCircle, History, Phone, Mail } from 'lucide-react';
import { Case, TrayScans } from '@/types';

interface CaseDetailsProps {
  caseItem: Case;
  onBack: () => void;
}

const CaseDetails = ({ caseItem, onBack }: CaseDetailsProps) => {
  // Mock scan history data with string dates
  const mockScanHistory: TrayScans[] = [
    {
      id: '1',
      case_id: caseItem.id,
      scanned_by: 'Mike Rodriguez',
      scanned_serial: caseItem.assigned_tray_serial,
      result: (caseItem.check_in_status === 'matched' ? 'matched' : 'mismatched') as 'matched' | 'mismatched',
      scanned_at: caseItem.check_in_time || new Date().toISOString()
    }
  ].filter(scan => caseItem.check_in_status !== 'not_checked_in');

  const getStatusBadge = (status: Case['check_in_status']) => {
    switch (status) {
      case 'matched':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Checked In</Badge>;
      case 'mismatched':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Mismatch</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getScanResultBadge = (result: 'matched' | 'mismatched') => {
    return result === 'matched' 
      ? <Badge className="bg-green-100 text-green-800 border-green-200 text-xs"><CheckCircle className="w-3 h-3 mr-1" />Match</Badge>
      : <Badge className="bg-red-100 text-red-800 border-red-200 text-xs"><XCircle className="w-3 h-3 mr-1" />Mismatch</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Case Details</h1>
              <p className="text-sm text-gray-500">Case ID: {caseItem.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Case Overview */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
              <CardTitle className="text-xl">{caseItem.hospital_name}</CardTitle>
              {getStatusBadge(caseItem.check_in_status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{caseItem.doctor_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{caseItem.city}, {caseItem.state}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="font-medium">{new Date(caseItem.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tray Serial</p>
                  <p className="font-medium font-mono">{caseItem.assigned_tray_serial}</p>
                </div>
              </div>
              {caseItem.check_in_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in Time</p>
                    <p className="font-medium">{new Date(caseItem.check_in_time).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Hospital Phone</p>
                  <p className="font-medium">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Contact Email</p>
                  <p className="font-medium">info@{caseItem.hospital_name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <History className="w-5 h-5 mr-2" />
              Scan History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockScanHistory.length > 0 ? (
              <div className="space-y-4">
                {mockScanHistory.map((scan) => (
                  <div key={scan.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-mono text-sm">{scan.scanned_serial}</span>
                          {getScanResultBadge(scan.result)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Scanned by: {scan.scanned_by}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(scan.scanned_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scan History</h3>
                <p className="text-gray-600">This case hasn't been scanned yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Standard surgical tray delivery for {caseItem.doctor_name} at {caseItem.hospital_name}. 
              Ensure tray is delivered 2 hours before scheduled procedure time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetails;
