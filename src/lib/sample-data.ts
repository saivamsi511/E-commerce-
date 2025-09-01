import { Products } from '@/entities/products';
import { Categories } from '@/entities/categories';

// Sample categories data
export const sampleCategories: Omit<Categories, '_id' | '_createdDate' | '_updatedDate'>[] = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronic devices",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=electronics-category",
    isActive: true,
    displayOrder: 1
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=fashion-category",
    isActive: true,
    displayOrder: 2
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home and garden",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=home-garden-category",
    isActive: true,
    displayOrder: 3
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Sports equipment and fitness gear",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=sports-fitness-category",
    isActive: true,
    displayOrder: 4
  },
  {
    name: "Books & Media",
    slug: "books-media",
    description: "Books, movies, and digital media",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=books-media-category",
    isActive: true,
    displayOrder: 5
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Health and beauty products",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=health-beauty-category",
    isActive: true,
    displayOrder: 6
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "Car accessories and automotive parts",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=automotive-category",
    isActive: true,
    displayOrder: 7
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Fun toys and games for all ages",
    categoryImage: "https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=toys-games-category",
    isActive: true,
    displayOrder: 8
  }
];

// Product templates for different categories
const productTemplates = {
  electronics: [
    { name: "Smartphone", price: 25000, description: "Latest smartphone with advanced features" },
    { name: "Laptop", price: 55000, description: "High-performance laptop for work and gaming" },
    { name: "Headphones", price: 3500, description: "Premium wireless headphones with noise cancellation" },
    { name: "Smart Watch", price: 15000, description: "Fitness tracking smartwatch with health monitoring" },
    { name: "Tablet", price: 20000, description: "Portable tablet for entertainment and productivity" },
    { name: "Camera", price: 45000, description: "Professional DSLR camera with multiple lenses" },
    { name: "Speaker", price: 8000, description: "Bluetooth speaker with superior sound quality" },
    { name: "Gaming Console", price: 35000, description: "Next-gen gaming console with 4K support" },
    { name: "Monitor", price: 18000, description: "4K monitor perfect for gaming and work" },
    { name: "Keyboard", price: 2500, description: "Mechanical gaming keyboard with RGB lighting" }
  ],
  fashion: [
    { name: "T-Shirt", price: 800, description: "Comfortable cotton t-shirt in various colors" },
    { name: "Jeans", price: 2500, description: "Premium denim jeans with perfect fit" },
    { name: "Dress", price: 3500, description: "Elegant dress for special occasions" },
    { name: "Sneakers", price: 4500, description: "Comfortable running sneakers for daily wear" },
    { name: "Jacket", price: 5500, description: "Stylish jacket for all weather conditions" },
    { name: "Handbag", price: 3000, description: "Designer handbag with multiple compartments" },
    { name: "Sunglasses", price: 1500, description: "UV protection sunglasses with trendy design" },
    { name: "Watch", price: 8000, description: "Luxury analog watch with leather strap" },
    { name: "Scarf", price: 1200, description: "Soft silk scarf in beautiful patterns" },
    { name: "Belt", price: 1800, description: "Genuine leather belt with metal buckle" }
  ],
  "home-garden": [
    { name: "Sofa", price: 25000, description: "Comfortable 3-seater sofa for living room" },
    { name: "Dining Table", price: 18000, description: "Wooden dining table for 6 people" },
    { name: "Bed", price: 22000, description: "Queen size bed with storage compartments" },
    { name: "Lamp", price: 3500, description: "Modern table lamp with adjustable brightness" },
    { name: "Curtains", price: 2500, description: "Blackout curtains for bedroom and living room" },
    { name: "Plant Pot", price: 800, description: "Decorative ceramic plant pot for indoor plants" },
    { name: "Garden Tools", price: 2200, description: "Complete set of gardening tools" },
    { name: "Cushions", price: 1500, description: "Soft decorative cushions for sofa" },
    { name: "Mirror", price: 4500, description: "Large decorative mirror for wall mounting" },
    { name: "Bookshelf", price: 8500, description: "5-tier wooden bookshelf for storage" }
  ],
  "sports-fitness": [
    { name: "Treadmill", price: 45000, description: "Electric treadmill with multiple workout programs" },
    { name: "Dumbbells", price: 3500, description: "Adjustable dumbbells for strength training" },
    { name: "Yoga Mat", price: 1200, description: "Non-slip yoga mat for exercise and meditation" },
    { name: "Basketball", price: 1800, description: "Official size basketball for outdoor play" },
    { name: "Tennis Racket", price: 5500, description: "Professional tennis racket with grip tape" },
    { name: "Cycling Helmet", price: 2500, description: "Safety helmet for cycling with ventilation" },
    { name: "Running Shoes", price: 6500, description: "Lightweight running shoes with cushioning" },
    { name: "Gym Bag", price: 2200, description: "Spacious gym bag with multiple compartments" },
    { name: "Protein Shaker", price: 800, description: "BPA-free protein shaker with measurement marks" },
    { name: "Resistance Bands", price: 1500, description: "Set of resistance bands for home workouts" }
  ],
  "books-media": [
    { name: "Fiction Novel", price: 450, description: "Bestselling fiction novel by popular author" },
    { name: "Cookbook", price: 850, description: "Comprehensive cookbook with 200+ recipes" },
    { name: "Self-Help Book", price: 650, description: "Motivational self-help book for personal growth" },
    { name: "Children's Book", price: 350, description: "Colorful illustrated book for children" },
    { name: "Biography", price: 750, description: "Inspiring biography of successful entrepreneur" },
    { name: "Art Book", price: 1200, description: "Coffee table book featuring famous artworks" },
    { name: "Travel Guide", price: 950, description: "Complete travel guide with maps and tips" },
    { name: "Educational Book", price: 1100, description: "Educational textbook for students" },
    { name: "Comic Book", price: 250, description: "Popular superhero comic book series" },
    { name: "Magazine", price: 150, description: "Monthly lifestyle and fashion magazine" }
  ],
  "health-beauty": [
    { name: "Face Cream", price: 1500, description: "Anti-aging face cream with natural ingredients" },
    { name: "Shampoo", price: 650, description: "Nourishing shampoo for all hair types" },
    { name: "Perfume", price: 3500, description: "Long-lasting perfume with floral fragrance" },
    { name: "Lipstick", price: 850, description: "Matte lipstick in vibrant colors" },
    { name: "Sunscreen", price: 750, description: "SPF 50 sunscreen for UV protection" },
    { name: "Face Mask", price: 450, description: "Hydrating face mask for glowing skin" },
    { name: "Hair Oil", price: 550, description: "Nourishing hair oil for healthy hair" },
    { name: "Body Lotion", price: 950, description: "Moisturizing body lotion with vitamin E" },
    { name: "Nail Polish", price: 350, description: "Quick-dry nail polish in trendy shades" },
    { name: "Eye Cream", price: 1200, description: "Anti-dark circle eye cream" }
  ],
  automotive: [
    { name: "Car Cover", price: 2500, description: "Waterproof car cover for outdoor protection" },
    { name: "Seat Covers", price: 3500, description: "Premium leather seat covers for cars" },
    { name: "Car Charger", price: 850, description: "Fast charging car charger with dual USB ports" },
    { name: "Air Freshener", price: 250, description: "Long-lasting car air freshener" },
    { name: "Floor Mats", price: 1500, description: "All-weather floor mats for cars" },
    { name: "Steering Cover", price: 650, description: "Comfortable steering wheel cover" },
    { name: "Car Vacuum", price: 4500, description: "Portable car vacuum cleaner" },
    { name: "Phone Mount", price: 1200, description: "Adjustable phone mount for dashboard" },
    { name: "Jump Starter", price: 5500, description: "Portable jump starter for emergencies" },
    { name: "Tire Gauge", price: 450, description: "Digital tire pressure gauge" }
  ],
  "toys-games": [
    { name: "Board Game", price: 1500, description: "Family board game for 2-6 players" },
    { name: "Puzzle", price: 850, description: "1000-piece jigsaw puzzle with beautiful image" },
    { name: "Action Figure", price: 1200, description: "Collectible action figure with accessories" },
    { name: "Doll", price: 2500, description: "Interactive doll with sound and movement" },
    { name: "Building Blocks", price: 3500, description: "Creative building blocks set for kids" },
    { name: "Remote Car", price: 4500, description: "Remote control car with rechargeable battery" },
    { name: "Art Set", price: 1800, description: "Complete art set with colors and brushes" },
    { name: "Musical Toy", price: 2200, description: "Educational musical toy for toddlers" },
    { name: "Sports Ball", price: 650, description: "Soft sports ball for indoor play" },
    { name: "Card Game", price: 450, description: "Strategy card game for teens and adults" }
  ]
};

// Generate sample products with exactly 10 products per category
export function generateSampleProducts(count: number = 80): Omit<Products, '_id' | '_createdDate' | '_updatedDate'>[] {
  const products: Omit<Products, '_id' | '_createdDate' | '_updatedDate'>[] = [];
  const categories = Object.keys(productTemplates);
  
  // Generate exactly 10 products per category
  categories.forEach((categoryKey, categoryIndex) => {
    const templates = productTemplates[categoryKey as keyof typeof productTemplates];
    
    // Generate 10 products for this category
    for (let i = 0; i < 10; i++) {
      const template = templates[i % templates.length];
      const priceVariation = 1 + (Math.random() - 0.5) * 0.3; // ±15% price variation
      const productIndex = categoryIndex * 10 + i;
      
      products.push({
        productName: i < templates.length ? template.name : `${template.name} Pro`,
        currency: "INR",
        category: categoryKey,
        mainImage: `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=product-${categoryKey}-${i + 1}`,
        shortDescription: template.description,
        longDescription: `${template.description}. This premium quality product offers excellent value for money and comes with manufacturer warranty. Perfect for daily use and built to last with high-quality materials and craftsmanship.`,
        price: Math.round(template.price * priceVariation),
        sku: `SKU-${categoryKey.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        isFeatured: i === 0 || i === 5 // Make first and 6th product of each category featured
      });
    }
  });
  
  return products;
}