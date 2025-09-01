import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { actions } = useMember();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email address is required.",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Validation Error",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Registration Successful!",
        description: "Welcome to ShopVibe! Please check your email to verify your account.",
      });

      // Redirect to login after successful registration
      actions.login();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Exclusive access to member-only deals",
    "Faster checkout with saved information",
    "Order tracking and history",
    "Personalized product recommendations",
    "Early access to new products",
    "Special birthday and anniversary offers"
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-primary rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                    Create Your Account
                  </h1>
                  <p className="font-paragraph text-primary-foreground/80">
                    Join ShopVibe and start your premium shopping experience
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-paragraph text-primary-foreground font-medium">
                        First Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="pl-10 bg-background border-0 rounded-xl font-paragraph"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-paragraph text-primary-foreground font-medium">
                        Last Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="pl-10 bg-background border-0 rounded-xl font-paragraph"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-paragraph text-primary-foreground font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="pl-10 bg-background border-0 rounded-xl font-paragraph"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-paragraph text-primary-foreground font-medium">
                      Password *
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
                        placeholder="Minimum 8 characters"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-paragraph text-primary-foreground font-medium">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className="pl-10 pr-10 bg-background border-0 rounded-xl font-paragraph"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeToTerms" className="font-paragraph text-primary-foreground/90 text-sm leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" className="text-secondary-foreground underline hover:no-underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-secondary-foreground underline hover:no-underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="subscribeNewsletter" className="font-paragraph text-primary-foreground/90 text-sm leading-relaxed">
                        Subscribe to our newsletter for exclusive offers and updates
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg py-4 rounded-2xl"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="font-paragraph text-primary-foreground/80">
                    Already have an account?{' '}
                    <button
                      onClick={actions.login}
                      className="text-secondary-foreground font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
                Join Our Community
              </h2>
              <p className="font-paragraph text-xl text-foreground/70 mb-8">
                Become a ShopVibe member and unlock exclusive benefits designed to enhance your shopping experience.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <span className="font-paragraph text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Card className="border-0 bg-secondary rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-semibold text-secondary-foreground mb-3">
                  Secure & Private
                </h3>
                <p className="font-paragraph text-secondary-foreground/80 text-sm">
                  Your personal information is protected with industry-standard encryption. We never share your data with third parties without your consent.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}