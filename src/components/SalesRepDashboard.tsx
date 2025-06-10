
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, User, Package, Scan, Clock, CheckCircle, XCircle, Menu, LogOut, FileText, ClipboardCheck, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import TrayScanner from './TrayScanner';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCases } from '@/hooks/useCases';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from './NotificationBell';
import { Database } from '@/types/database';

type CaseType = Database['public']['Tables']['cases']['Row'] & {
  profiles: {
    name: string;
  };
};

interface SalesRepDashboardProps {
  user: any;
  onLogout: () => void;
}

const SalesRepDashboard = ({ user, onLogout }: SalesRepDashboardProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { cases, loading: casesLoading, updateCase, addTrayScans } = useCases();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleScanClick = (caseItem: CaseType) => {
    setSelectedCase(caseItem);
    setShowScanner(true);
  };

  const handleScanResult = async (scannedSerial: string) => {
    if (!selectedCase) return;

    try {
      const isMatch = scannedSerial === selectedCase.assigned_tray_serial;
      const newStatus = isMatch ? 'matched' : 'mismatched';
      const newWorkflowStatus = isMatch ? 'checked_in' : 'pending_checkin';

      // Add tray scan record
      await addTrayScans(selectedCase.id, scannedSerial, newStatus);

      // Update case status
      await updateCase(selectedCase.id, {
        check_in_status: newStatus,
        check_in_time: new Date().toISOString(),
        workflow_status: newWorkflowStatus
      });

      toast({
        title: isMatch ? "Tray Matched!" : "Tray Mismatch",
        description: isMatch 
          ? `Tray ${scannedSerial} successfully checked in. You can now submit the invoice.`
          : `Expected ${selectedCase.assigned_tray_serial}, got ${scannedSerial}`,
        variant: isMatch ? "default" : "destructive"
      });

      setShowScanner(false);
      setSelectedCase(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update case status",
        variant: "destructive"
      });
    }
  };

  const handleInvoiceSubmit = async (caseItem: CaseType) => {
    try {
      await updateCase(caseItem.id, {
        invoice_submitted: true,
        invoice_submitted_time: new Date().toISOString(),
        workflow_status: 'invoice_submitted'
      });

      toast({
        title: "Invoice Submitted",
        description: "Invoice has been marked as submitted. You can now complete the case.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit invoice",
        variant: "destructive"
      });
    }
  };

  const handleCaseComplete = (caseItem: CaseType) => {
    setSelectedCase(caseItem);
    setShowNotes(true);
  };

  const handleNotesSubmit = async () => {
    if (!selectedCase) return;

    try {
      await updateCase(selectedCase.id, {
        case_completed: true,
        case_completed_time: new Date().toISOString(),
        completion_notes: completionNotes,
        workflow_status: 'case_completed'
      });

      toast({
        title: "Case Completed",
        description: "Case has been successfully completed with notes.",
      });

      setShowNotes(false);
      setSelectedCase(null);
      setCompletionNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete case",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (caseItem: CaseType) => {
    switch (caseItem.workflow_status) {
      case 'case_completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'invoice_submitted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs"><FileText className="w-3 h-3 mr-1" />Invoice Submitted</Badge>;
      case 'checked_in':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"><ClipboardCheck className="w-3 h-3 mr-1" />Checked In</Badge>;
      case 'pending_checkin':
        if (caseItem.check_in_status === 'mismatched') {
          return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs"><XCircle className="w-3 h-3 mr-1" />Mismatch</Badge>;
        }
        return <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getActionButton = (caseItem: CaseType) => {
    switch (caseItem.workflow_status) {
      case 'case_completed':
        return (
          <Button disabled className="w-full text-sm sm:text-base" variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Case Completed
          </Button>
        );
      case 'invoice_submitted':
        return (
          <Button 
            onClick={() => handleCaseComplete(caseItem)}
            className="w-full text-sm sm:text-base"
          >
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Complete Case
          </Button>
        );
      case 'checked_in':
        return (
          <Button 
            onClick={() => handleInvoiceSubmit(caseItem)}
            className="w-full text-sm sm:text-base"
          >
            <FileText className="w-4 h-4 mr-2" />
            Submit Invoice
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => handleScanClick(caseItem)}
            disabled={caseItem.check_in_status === 'matched'}
            className="w-full text-sm sm:text-base"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan to Check-in
          </Button>
        );
    }
  };

  const todayCases = cases.filter(c => {
    const today = new Date();
    const caseDate = new Date(c.date);
    return caseDate.toDateString() === today.toDateString();
  });

  if (casesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (showScanner) {
    return (
      <TrayScanner
        expectedSerial={selectedCase?.assigned_tray_serial || ''}
        onScanResult={handleScanResult}
        onCancel={() => {
          setShowScanner(false);
          setSelectedCase(null);
        }}
      />
    );
  }

  if (showNotes) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Complete Case</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Case: {selectedCase?.hospital_name}</p>
              <p className="text-sm text-gray-600">Doctor: {selectedCase?.doctor_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Completion Notes (Optional)
              </label>
              <Textarea
                placeholder="Add any notes about the case completion..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleNotesSubmit} className="flex-1">
                Complete Case
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNotes(false);
                  setSelectedCase(null);
                  setCompletionNotes('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-white font-bold text-sm sm:text-base">S</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Surgipho</h1>
            </div>
            
            {/* Mobile Menu */}
            <div className="sm:hidden flex items-center space-x-2">
              <NotificationBell />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="text-sm text-gray-700 pb-2 border-b">
                      Welcome, {user.name}
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <NotificationBell />
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Today's Cases</h2>
          <p className="text-sm sm:text-base text-gray-600">You have {todayCases.length} cases scheduled for today</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {todayCases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                      {caseItem.hospital_name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs sm:text-sm">{caseItem.city}, {caseItem.state}</span>
                    </div>
                  </div>
                  <div className="self-start">
                    {getStatusBadge(caseItem)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 truncate">Dr: {caseItem.doctor_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">
                      {new Date(caseItem.date).toLocaleString([], { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 font-mono">{caseItem.assigned_tray_serial}</span>
                  </div>
                  {caseItem.case_completed_time && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Completed: {new Date(caseItem.case_completed_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <Separator className="mb-4" />
                {getActionButton(caseItem)}
              </CardContent>
            </Card>
          ))}
        </div>

        {todayCases.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Cases Today</h3>
              <p className="text-sm sm:text-base text-gray-600">You don't have any cases scheduled for today.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesRepDashboard;
