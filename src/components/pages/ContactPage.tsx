import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@shopvibe.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Commerce Street, Business District",
      description: "Our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8am-5pm",
      description: "Weekend support available"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
            Have questions about our products or need assistance? We're here to help you with exceptional customer service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-primary rounded-3xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-paragraph text-primary-foreground font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl font-paragraph"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-paragraph text-primary-foreground font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl font-paragraph"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-paragraph text-primary-foreground font-medium">
                        Category
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-background border-0 rounded-xl font-paragraph">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="product">Product Question</SelectItem>
                          <SelectItem value="order">Order Support</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-paragraph text-primary-foreground font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl font-paragraph"
                        placeholder="Brief subject line"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-paragraph text-primary-foreground font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={6}
                      className="bg-background border-0 rounded-xl font-paragraph resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg py-4 rounded-2xl"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">
              Contact Information
            </h2>

            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="border-0 bg-secondary rounded-3xl hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-secondary-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="font-paragraph text-secondary-foreground font-medium mb-1">
                          {info.content}
                        </p>
                        <p className="font-paragraph text-secondary-foreground/70 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8"
            >
              <Card className="border-0 bg-primary rounded-3xl">
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-4">
                    Quick Response Guarantee
                  </h3>
                  <p className="font-paragraph text-primary-foreground/80 text-sm">
                    We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-paragraph text-foreground/70">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What are your shipping options?",
                answer: "We offer free standard shipping on all orders over $50. Express shipping is available for an additional fee."
              },
              {
                question: "What is your return policy?",
                answer: "We accept returns within 30 days of purchase for unused items in original packaging."
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
              },
              {
                question: "How can I track my order?",
                answer: "Once your order ships, you'll receive a tracking number via email to monitor your package."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-secondary rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-secondary-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="font-paragraph text-secondary-foreground/80">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}