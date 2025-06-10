
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import SalesRepDashboard from '@/components/SalesRepDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  if (profile.role === 'admin') {
    return <AdminDashboard user={profile} onLogout={() => {}} />;
  }

  return <SalesRepDashboard user={profile} onLogout={() => {}} />;
};

export default Index;
