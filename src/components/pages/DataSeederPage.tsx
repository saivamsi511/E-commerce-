import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { generateSampleProducts, sampleCategories } from '@/lib/sample-data';
import { Database, Package, FolderOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataSeederPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [completed, setCompleted] = useState(false);

  const seedDatabase = async () => {
    setIsSeeding(true);
    setProgress(0);
    setCompleted(false);

    try {
      // Step 1: Add categories
      setCurrentStep('Adding categories...');
      setProgress(10);
      
      for (const category of sampleCategories) {
        await BaseCrudService.create('categories', {
          ...category,
          _id: crypto.randomUUID()
        });
      }

      setProgress(30);
      setCurrentStep('Generating products...');
      
      // Step 2: Generate products (10 per category = 80 total)
      const products = generateSampleProducts(80);
      
      setProgress(40);
      setCurrentStep('Adding products to database...');

      // Step 3: Add products in batches
      const batchSize = 50;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(product => 
            BaseCrudService.create('products', {
              ...product,
              _id: crypto.randomUUID()
            })
          )
        );
        
        const progressPercent = 40 + ((i + batchSize) / products.length) * 50;
        setProgress(Math.min(progressPercent, 90));
        setCurrentStep(`Added ${Math.min(i + batchSize, products.length)} of ${products.length} products...`);
      }

      setProgress(100);
      setCurrentStep('Database seeding completed!');
      setCompleted(true);

      toast({
        title: "Database Seeded Successfully!",
        description: `Added ${sampleCategories.length} categories and 80 products (10 per category) to your store.`,
      });

    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: "Seeding Failed",
        description: "There was an error adding data to the database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Database Seeder
          </h1>
          <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
            Populate your store with sample data including categories and 80 products (10 products per category).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 bg-primary rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-primary-foreground flex items-center gap-3">
                <FolderOpen className="w-6 h-6" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-paragraph text-primary-foreground/80 mb-4">
                Will add {sampleCategories.length} product categories:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {sampleCategories.slice(0, 8).map((category, index) => (
                  <div key={index} className="bg-primary-foreground/10 rounded-xl p-2">
                    <span className="font-paragraph text-primary-foreground text-sm">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-secondary rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-secondary-foreground flex items-center gap-3">
                <Package className="w-6 h-6" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-paragraph text-secondary-foreground/80 mb-4">
                Will generate 80 unique products (10 per category) with:
              </p>
              <ul className="space-y-2">
                {[
                  'Unique names and SKUs',
                  'Realistic pricing',
                  'Category assignments',
                  'Product descriptions',
                  'Featured product flags'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-paragraph text-secondary-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Seeding Progress */}
        {isSeeding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-0 bg-background rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Seeding Database...
                  </h3>
                  <p className="font-paragraph text-foreground/70">
                    {currentStep}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm font-paragraph text-foreground/60">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Success Message */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-0 bg-green-50 border-green-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-green-800 mb-2">
                  Database Seeded Successfully!
                </h3>
                <p className="font-paragraph text-green-700">
                  Your store now has 80 products (10 per category) across multiple categories. You can now browse and manage your products.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Warning */}
        <Card className="border-0 bg-yellow-50 border-yellow-200 rounded-3xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-yellow-800 mb-2">
                  Important Notice
                </h3>
                <p className="font-paragraph text-yellow-700 text-sm">
                  This will add sample data to your database. If you already have products, this may create duplicates. 
                  The seeding process may take a few minutes to complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={seedDatabase}
            disabled={isSeeding || completed}
            size="lg"
            className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg px-12 py-4 rounded-2xl"
          >
            {isSeeding ? 'Seeding Database...' : completed ? 'Database Seeded' : 'Start Database Seeding'}
          </Button>
        </div>
      </div>
    </div>
  );
}