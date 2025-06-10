import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Jackson Williams',
      email: 'admin@surgipho.com',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'rep@surgipho.com',
      role: 'rep',
      assigned_case_ids: ['1', '2']
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'demo123') {
        onLogin(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Try admin@surgipho.com or rep@surgipho.com with password 'demo123'",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">S</span>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Surgipho</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-xs sm:text-sm text-gray-600 mt-4 space-y-1">
              <p className="font-medium">Demo Accounts:</p>
              <p><strong>Admin:</strong> admin@surgipho.com</p>
              <p><strong>Rep:</strong> rep@surgipho.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
