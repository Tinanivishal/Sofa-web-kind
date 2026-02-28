import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const ADMIN_ROLES = ['ADMIN', 'MANAGER', 'TECHNICIAN'];

export default function AdminLogin() {
  const { login, logout, registerCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(username, password);
      const isAdmin = user?.role && ADMIN_ROLES.includes(user.role.toUpperCase());
      if (!isAdmin) {
        logout();
        setError(
          "This account doesn't have admin access. Please sign in with an admin, manager, or technician account."
        );
        return;
      }
      const redirectTo = state?.from?.pathname && state.from.pathname !== '/admin/login'
        ? state.from.pathname
        : '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);

    try {
      await registerCustomer({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setIsRegisterOpen(false);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Admin Login
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            Sign in as an admin to manage products, orders, customers, and all Sofa project
            settings in one place.
          </p>
        </div>

        <Card className="shadow-xl border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="w-5 h-5 text-amber-600" />
              <span>Sign in to Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or email</Label>
                <Input
                  id="username"
                  placeholder="Enter admin username or email"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Don&apos;t have an account?
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium hover:underline"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Sign up / Register</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a customer account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4 pt-2">
                    {registerError && (
                      <div className="rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2">
                        {registerError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={registerName}
                        onChange={(event) => setRegisterName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerEmail}
                        onChange={(event) => setRegisterEmail(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This registration creates a <span className="font-semibold">customer</span> role only.
                      Admin access is reserved for system owners.
                    </p>
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={registerLoading}
                    >
                      {registerLoading ? 'Creating account...' : 'Sign up'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

