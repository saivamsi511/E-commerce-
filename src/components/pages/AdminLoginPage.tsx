import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate admin authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo credentials check
      if (formData.username === 'admin' && formData.password === 'admin123') {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 bg-primary rounded-3xl">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                  Admin Access
                </h1>
                <p className="font-paragraph text-primary-foreground/80">
                  Secure login for administrators only
                </p>
              </div>

              {/* Warning Notice */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-yellow-800 mb-1">
                      Restricted Access
                    </h3>
                    <p className="font-paragraph text-yellow-700 text-xs">
                      This area is for authorized administrators only. All access attempts are logged and monitored.
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="bg-secondary/20 rounded-2xl p-4 mb-6">
                <h3 className="font-heading text-sm font-semibold text-primary-foreground mb-2">
                  Demo Credentials
                </h3>
                <div className="space-y-1 text-xs font-paragraph text-primary-foreground/80">
                  <p>Username: <span className="font-mono bg-background/20 px-1 rounded">admin</span></p>
                  <p>Password: <span className="font-mono bg-background/20 px-1 rounded">admin123</span></p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-paragraph text-primary-foreground font-medium">
                    Admin Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      required
                      className="pl-10 bg-background border-0 rounded-xl font-paragraph"
                      placeholder="Enter admin username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-paragraph text-primary-foreground font-medium">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="pl-10 pr-10 bg-background border-0 rounded-xl font-paragraph"
                      placeholder="Enter admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg py-4 rounded-2xl"
                >
                  {isSubmitting ? "Authenticating..." : "Access Admin Panel"}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <p className="font-paragraph text-primary-foreground/60 text-xs">
                  Protected by enterprise-grade security protocols
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Site */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="font-paragraph text-foreground/70 hover:text-foreground text-sm underline"
            >
              ← Back to ShopVibe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}