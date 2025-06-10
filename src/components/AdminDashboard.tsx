import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LogOut, Plus, Filter, Search, Calendar as CalendarIcon, Users, Package, TrendingUp, BarChart3, CheckCircle, XCircle, Clock, MapPin, User, Eye, FileText, ClipboardCheck, Edit } from 'lucide-react';
import { User as UserType, Case } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ReportsAnalytics from './ReportsAnalytics';
import CaseDetails from './CaseDetails';
import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [newCase, setNewCase] = useState<Partial<Case>>({
    doctor_name: '',
    hospital_name: '',
    city: '',
    state: '',
    assigned_rep_id: '',
    assigned_tray_serial: '',
    date: ''
  });
  const [users, setUsers] = useState<Database['public']['Tables']['users']['Row'][]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch users with proper error handling
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'rep') // Only get reps, not admins
          .order('name');

        if (error) {
          console.error('Error fetching users:', error);
          toast({
            title: "Error",
            description: "Failed to fetch users. Please try again.",
            variant: "destructive"
          });
          return;
        }

        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch all cases from Supabase
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .order('date');

        if (error) throw error;
        setCases(data || []);
      } catch (error) {
        console.error('Error fetching cases:', error);
        toast({
          title: "Error",
          description: "Failed to fetch cases. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchCases();
  }, []);

  const getRepName = (repId: string) => {
    const user = users.find(u => u.id === repId);
    return user ? user.name : 'Unknown Rep';
  };

  const handleAddCase = async () => {
    try {
      const { error } = await supabase
        .from('cases')
        .insert([{
          doctor_name: newCase.doctor_name,
          hospital_name: newCase.hospital_name,
          city: newCase.city,
          state: newCase.state,
          assigned_rep_id: newCase.assigned_rep_id,
          assigned_tray_serial: newCase.assigned_tray_serial,
          date: new Date(newCase.date).toISOString(),
          workflow_status: 'pending_checkin'
        }]);

      if (error) throw error;

      toast({
        title: "Case Added",
        description: "New case has been successfully created.",
      });
      setIsAddingCase(false);
      setNewCase({
        doctor_name: '',
        hospital_name: '',
        city: '',
        state: '',
        assigned_rep_id: '',
        assigned_tray_serial: '',
        date: ''
      });
    } catch (error) {
      console.error('Error adding case:', error);
      toast({
        title: "Error",
        description: "Failed to add case. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setIsEditingCase(true);
  };

  const handleSaveCase = () => {
    if (editingCase) {
      const updatedCases = cases.map(c => 
        c.id === editingCase.id ? editingCase : c
      );
      setCases(updatedCases);
      
      toast({
        title: "Case Updated",
        description: "Case details have been successfully updated.",
      });
      setIsEditingCase(false);
      setEditingCase(null);
    }
  };

  const handleEditFieldChange = (field: string, value: string | Date) => {
    if (editingCase) {
      setEditingCase({
        ...editingCase,
        [field]: value instanceof Date ? value.toISOString() : value
      });
    }
  };

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const getStatusBadge = (caseItem: Case) => {
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

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assigned_tray_serial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || caseItem.workflow_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.workflow_status === 'pending_checkin').length,
    checked_in: cases.filter(c => c.workflow_status === 'checked_in').length,
    invoice_submitted: cases.filter(c => c.workflow_status === 'invoice_submitted').length,
    completed: cases.filter(c => c.workflow_status === 'case_completed').length,
    mismatched: cases.filter(c => c.check_in_status === 'mismatched').length
  };

  // Show case details if a case is selected
  if (selectedCaseId) {
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (selectedCase) {
      return <CaseDetails caseItem={selectedCase} onBack={() => setSelectedCaseId(null)} />;
    }
  }

  if (activeTab === 'reports') {
    return <ReportsAnalytics onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">S</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Surgipho Admin</h1>
                <p className="text-xs sm:text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="self-end sm:self-auto">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-4 sm:px-6">
        <div className="flex space-x-1 overflow-x-auto">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dashboard')}
            className="whitespace-nowrap"
          >
            <Package className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('reports')}
            className="whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Reports</span>
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Cases</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Checked In</p>
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{stats.checked_in}</p>
                </div>
                <ClipboardCheck className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Invoice Submitted</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.invoice_submitted}</p>
                </div>
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Completed</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Mismatches</p>
                  <p className="text-lg sm:text-xl font-bold text-red-600">{stats.mismatched}</p>
                </div>
                <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cases, doctors, or tray serials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2 sm:space-x-0 sm:flex-row sm:gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="pending_checkin">Pending Check-in</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="invoice_submitted">Invoice Submitted</SelectItem>
                <SelectItem value="case_completed">Case Completed</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Add Case Dialog */}
            <Dialog open={isAddingCase} onOpenChange={setIsAddingCase}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-initial">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Case</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg font-semibold">Add New Case</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hospital" className="text-sm font-medium">Hospital Name</Label>
                    <Input id="hospital" placeholder="Enter hospital name" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">City</Label>
                      <Input id="city" placeholder="City" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">State</Label>
                      <Input id="state" placeholder="State" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="doctor" className="text-sm font-medium">Doctor Name</Label>
                    <Input id="doctor" placeholder="Dr. Name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="tray" className="text-sm font-medium">Tray Serial</Label>
                    <Input id="tray" placeholder="TR-2024-XXX" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="rep" className="text-sm font-medium">Assigned Rep</Label>
                    <Select value={newCase.assigned_rep_id} onValueChange={(value) => setNewCase(prev => ({ ...prev, assigned_rep_id: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select rep" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCase} className="w-full mt-6">Create Case</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Case Dialog - Fixed for iOS mobile to prevent horizontal scroll */}
            <Dialog open={isEditingCase} onOpenChange={(open) => {
              setIsEditingCase(open);
              if (!open) {
                setEditingCase(null);
              }
            }}>
              <DialogContent className="w-[95vw] max-w-[280px] max-h-[85vh] overflow-y-auto overflow-x-hidden p-3 mx-auto">
                <DialogHeader className="pb-3 px-0">
                  <DialogTitle className="text-base font-semibold">Edit Case</DialogTitle>
                </DialogHeader>
                {editingCase && (
                  <div className="space-y-3 px-0 overflow-x-hidden">
                    <div className="min-w-0">
                      <Label htmlFor="edit-hospital" className="text-xs font-medium">Hospital Name</Label>
                      <Input 
                        id="edit-hospital" 
                        value={editingCase.hospital_name}
                        onChange={(e) => handleEditFieldChange('hospital_name', e.target.value)}
                        className="mt-1 text-sm h-9 w-full min-w-0" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 min-w-0">
                      <div className="min-w-0">
                        <Label htmlFor="edit-city" className="text-xs font-medium">City</Label>
                        <Input 
                          id="edit-city" 
                          value={editingCase.city}
                          onChange={(e) => handleEditFieldChange('city', e.target.value)}
                          className="mt-1 text-sm h-9 w-full min-w-0" 
                        />
                      </div>
                      <div className="min-w-0">
                        <Label htmlFor="edit-state" className="text-xs font-medium">State</Label>
                        <Input 
                          id="edit-state" 
                          value={editingCase.state}
                          onChange={(e) => handleEditFieldChange('state', e.target.value)}
                          className="mt-1 text-sm h-9 w-full min-w-0" 
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="edit-doctor" className="text-xs font-medium">Doctor Name</Label>
                      <Input 
                        id="edit-doctor" 
                        value={editingCase.doctor_name}
                        onChange={(e) => handleEditFieldChange('doctor_name', e.target.value)}
                        className="mt-1 text-sm h-9 w-full min-w-0" 
                      />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="edit-tray" className="text-xs font-medium">Tray Serial</Label>
                      <Input 
                        id="edit-tray" 
                        value={editingCase.assigned_tray_serial}
                        onChange={(e) => handleEditFieldChange('assigned_tray_serial', e.target.value)}
                        className="mt-1 text-sm h-9 w-full min-w-0" 
                      />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="edit-rep" className="text-xs font-medium">Assigned Rep</Label>
                      <Select 
                        value={editingCase.assigned_rep_id} 
                        onValueChange={(value) => handleEditFieldChange('assigned_rep_id', value)}
                      >
                        <SelectTrigger className="mt-1 h-9 text-sm w-full min-w-0">
                          <SelectValue placeholder="Select rep" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="edit-date" className="text-xs font-medium">Date</Label>
                      <input 
                        id="edit-date"
                        type="date"
                        value={editingCase.date ? new Date(editingCase.date).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleEditFieldChange('date', new Date(e.target.value));
                          }
                        }}
                        className="mt-1 text-sm h-9 w-full min-w-0 flex rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box-border"
                        style={{ 
                          fontSize: '16px',
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield'
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="edit-status" className="text-xs font-medium">Workflow Status</Label>
                      <Select 
                        value={editingCase.workflow_status} 
                        onValueChange={(value) => handleEditFieldChange('workflow_status', value)}
                      >
                        <SelectTrigger className="mt-1 h-9 text-sm w-full min-w-0">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending_checkin">Pending Check-in</SelectItem>
                          <SelectItem value="checked_in">Checked In</SelectItem>
                          <SelectItem value="invoice_submitted">Invoice Submitted</SelectItem>
                          <SelectItem value="case_completed">Case Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveCase} className="w-full mt-4 h-9 text-sm">Save Changes</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredCases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{caseItem.hospital_name}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{caseItem.city}, {caseItem.state}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{caseItem.doctor_name}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <span className="text-xs sm:text-sm">Rep: {getRepName(caseItem.assigned_rep_id)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm font-mono">{caseItem.assigned_tray_serial}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{new Date(caseItem.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {getStatusBadge(caseItem)}
                      {caseItem.check_in_time && (
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(caseItem.check_in_time).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCase(caseItem.id)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCase(caseItem)}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Cases Found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
