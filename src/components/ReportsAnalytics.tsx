import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Users, Package, CheckCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface ReportsAnalyticsProps {
  onBack: () => void;
}

const ReportsAnalytics = ({ onBack }: ReportsAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState('30');

  // Mock data for charts - focused on case completion rates
  const casesByMonth = [
    { month: 'Jan', cases: 45, completed: 40, pending: 5 },
    { month: 'Feb', cases: 52, completed: 48, pending: 4 },
    { month: 'Mar', cases: 38, completed: 35, pending: 3 },
    { month: 'Apr', cases: 61, completed: 55, pending: 6 },
    { month: 'May', cases: 55, completed: 52, pending: 3 },
    { month: 'Jun', cases: 48, completed: 45, pending: 3 }
  ];

  const caseStatus = [
    { name: 'Completed', value: 275, color: '#22c55e' },
    { name: 'Invoice Submitted', value: 18, color: '#f59e0b' },
    { name: 'Checked In', value: 12, color: '#3b82f6' },
    { name: 'Pending Check-in', value: 8, color: '#ef4444' }
  ];

  const topHospitals = [
    { name: 'City General Hospital', cases: 35, completed: 33, completionRate: 94 },
    { name: 'St. Mary Medical Center', cases: 28, completed: 26, completionRate: 93 },
    { name: 'Regional Health System', cases: 22, completed: 21, completionRate: 95 },
    { name: 'University Hospital', cases: 18, completed: 16, completionRate: 89 },
    { name: 'Metro Surgical Center', cases: 15, completed: 14, completionRate: 93 }
  ];

  const repPerformance = [
    { name: 'Mike Rodriguez', cases: 42, completed: 40, completionRate: 95 },
    { name: 'Sarah Johnson', cases: 38, completed: 37, completionRate: 97 },
    { name: 'David Chen', cases: 35, completed: 32, completionRate: 91 },
    { name: 'Lisa Williams', cases: 32, completed: 30, completionRate: 94 },
    { name: 'Tom Anderson', cases: 28, completed: 25, completionRate: 89 }
  ];

  const doctorPerformance = [
    { name: 'Dr. Emily Chen', cases: 18, completed: 17, completionRate: 94 },
    { name: 'Dr. Robert Martinez', cases: 16, completed: 15, completionRate: 94 },
    { name: 'Dr. Sarah Wilson', cases: 14, completed: 13, completionRate: 93 },
    { name: 'Dr. Michael Brown', cases: 12, completed: 11, completionRate: 92 },
    { name: 'Dr. Jennifer Davis', cases: 11, completed: 10, completionRate: 91 }
  ];

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#22c55e",
    },
    pending: {
      label: "Pending",
      color: "#ef4444",
    },
    cases: {
      label: "Total Cases",
      color: "#3b82f6",
    },
  };

  const totalCases = 313;
  const completedCases = 275;
  const overallCompletionRate = Math.round((completedCases / totalCases) * 100);

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-gray-900 truncate">Reports & Analytics</h1>
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-full overflow-x-hidden">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600">Total Cases</p>
                  <p className="text-xl font-bold text-gray-900">{totalCases}</p>
                  <p className="text-xs text-green-600">+12%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600">Completion Rate</p>
                  <p className="text-xl font-bold text-gray-900">{overallCompletionRate}%</p>
                  <p className="text-xs text-green-600">+3.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600">Active Reps</p>
                  <p className="text-xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">All active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600">Cases Completed</p>
                  <p className="text-xl font-bold text-gray-900">{completedCases}</p>
                  <p className="text-xs text-green-600">87.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="text-xs py-2">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs py-2">Performance</TabsTrigger>
            <TabsTrigger value="hospitals" className="text-xs py-2">Hospitals</TabsTrigger>
            <TabsTrigger value="reps" className="text-xs py-2">Reps</TabsTrigger>
            <TabsTrigger value="doctors" className="text-xs py-2 col-span-2 lg:col-span-1">Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Case Completion by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={casesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="completed" fill="var(--color-completed)" />
                        <Bar dataKey="pending" fill="var(--color-pending)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Case Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={caseStatus}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {caseStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Completion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={casesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="cases" stroke="var(--color-cases)" strokeWidth={2} />
                      <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hospital Performance by Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topHospitals.map((hospital, index) => (
                    <div key={hospital.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-gray-900 text-sm truncate block">{hospital.name}</span>
                          <span className="text-xs text-gray-500">{hospital.completed}/{hospital.cases} completed</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600 flex-shrink-0">{hospital.completionRate}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reps">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rep Performance by Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {repPerformance.map((rep) => (
                    <div key={rep.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-purple-600">{rep.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">{rep.name}</p>
                          <p className="text-xs text-gray-500">{rep.completed}/{rep.cases} completed</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-green-600">{rep.completionRate}%</p>
                        <p className="text-xs text-gray-500">completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Doctor Performance by Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctorPerformance.map((doctor, index) => (
                    <div key={doctor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.completed}/{doctor.cases} completed</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-green-600">{doctor.completionRate}%</p>
                        <p className="text-xs text-gray-500">completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
