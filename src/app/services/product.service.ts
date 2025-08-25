import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);

  
private aiConcepts: any[] = [
  {
    name: "Natural Language Processing (NLP)",
    definition: "Enables machines to understand, interpret, and respond to human language (text or voice).",
    examples: ["Chatbots", "Product search", "Sentiment analysis"]
  },
  {
    name: "Recommendation Systems",
    definition: "Uses data to suggest relevant products, content, or actions to users.",
    examples: ["E-commerce product suggestions", "Movie recommendations", "Content personalization"]
  },
  // add more AI concepts here
];
  private mockProducts: Product[] = [
    {
      id: '3',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      price: 299.99,
      originalPrice: 399.99,
      images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
      category: 'Electronics',
      brand: 'AudioTech',
      rating: 4.8,
      reviewCount: 1250,
       relatedProducts: [2, 18, 19],
      inStock: true,
      features: ['Noise Cancellation', '30-hour Battery', 'Quick Charge', 'Premium Build'],
      specifications: {
        'Battery Life': '30 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Warranty': '2 years'
      },
    },
    {
      id: '17',
      name: 'Smart Fitness Tracker',
      description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
      price: 199.99,
      originalPrice: 249.99,
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
      category: 'Wearables',
      brand: 'FitTech',
      rating: 4.6,
      reviewCount: 890,
      inStock: true,
      relatedProducts: [22, 23],
      features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
      specifications: {
        'Battery Life': '7 days',
        'Display': 'AMOLED',
        'Water Rating': '5ATM',
        'Sensors': 'HR, GPS, Accelerometer'
      },
    },
    {
      id: '11',
      name: 'Professional Camera Lens',
      description: 'High-performance camera lens for professional photography.',
      price: 899.99,
      originalPrice: 1199.99,
      images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'],
      category: 'Photography',
      brand: 'LensMaster',
      rating: 4.9,
      reviewCount: 567,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['Ultra-Wide Angle', 'Image Stabilization', 'Weather Sealed', 'Fast Autofocus'],
      specifications: {
        'Focal Length': '16-35mm',
        'Aperture': 'f/2.8',
        'Weight': '680g',
        'Mount': 'Universal'
      }
    },
    {
      id: '4',
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard designed for gaming enthusiasts.',
      price: 149.99,
      originalPrice: 199.99,
      images: ['https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg'],
      category: 'Gaming',
      brand: 'GameTech',
      rating: 4.7,
      reviewCount: 2100,
      inStock: true,
      relatedProducts: [ 2, 1],
      features: ['RGB Backlighting', 'Mechanical Switches', 'Anti-Ghosting', 'Programmable Keys'],
      specifications: {
        'Switch Type': 'Blue Mechanical',
        'Connectivity': 'USB-C',
        'Backlighting': 'RGB',
        'Key Layout': 'Full Size'
      }
    },
    {
      id: '1',
      name: 'Vivo V60 5G',
      description: '50 MP Zeiss OIS Main Camera: OIS; f/1.88; FOV 84°; 6P lens, 50 MP Zeiss Super Telephoto Camera: AF; OIS, f/2.65, FoV 33.1°, 4P lens 10X Telephoto Stage Portrait, 8 MP ZEISS Ultra Wide-Angle camera: f2.0, FoV 120° ± 3, 5P lens | Front Camera: 50 MP ZEISS Group Selfie Camera: AF, f/2.2, FoV 92° ± 3°, 5P lens | 4K/1080P/720P Video Recording Resolution.',
      price: 89.99,
      originalPrice: 129.99,
      images: ['../../assets/vivo.jpg'],
      category: 'Smartphones',
      brand: 'Vivo',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 14, 16,15],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    },
     {
      id: '12',
      name: 'large laptop backpack',
      description: 'Safari Omega spacious/large laptop backpack with Raincover, college bag, travel bag for men and women, Black, 30 Litre.',
      price: 99.00,
      originalPrice: 129.99,
      images: ['../../assets/safaribag.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '13',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 939.00,
      originalPrice: 129.99,
      images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '5',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 9.00,
      originalPrice: 129.99,
      images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '14',
      name: 'Boat Headphone',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 79.00,
      originalPrice: 129.99,
      images: ['../../assets/boatheadphone.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '15',
      name: 'Back Cover',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 66.00,
      originalPrice: 129.99,
      images: ['../../assets/backcover.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '16',
      name: 'Back cover2',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 45.00,
      originalPrice: 129.99,
      images: ['../../assets/back cover 2.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '2',
      name: 'HP OmniBook',
      description: 'Snapdragon X Plus Processor for Performance on the Move】 Stay productive wherever you go with the Snapdragon X processor offering 8 cores, 8 threads, and 12 MB L3 cache for responsive multitasking, and up to 47 TOPS of NPU power.',
      price: 110.00,
      originalPrice: 129.99,
      images: ['../../assets/Laptop.jpg'],
      category: 'Laptops',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 19, 18,11,20,21],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '18',
      name: 'Headphone Stand ',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 120.00,
      originalPrice: 129.99,
      images: ['../../assets/71maDC2XPpL._SX522_.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '19',
      name: 'PLIXIO Aluminum Tabletop Laptop Stand Ergonomic',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 320.00,
      originalPrice: 129.99,
      images: ['../../assets/laptop stand.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '10',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 350.00,
      originalPrice: 129.99,
      images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, {
      id: '20',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 3890.00,
      originalPrice: 129.99,
      images: ['../../assets/charger.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    }, 
    
    {
      id: '21',
      name: 'key board',
      description: 'Compact wireless speaker with powerful sound and long battery life.',
      price: 60.00,
      originalPrice: 129.99,
      images: ['../../assets/keyboard.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    },
     {
      id: '22',
      name: 'key board',
      description: 'Wisely Protective Case Cover Compatible with Huawei Watch Fit 4',
      price: 650.00,
      originalPrice: 129.99,
      images: ['../../assets/watch cover.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    },

  {
      id: '23',
      name: 'key board',
      description: 'Wisely Protective Case Cover Compatible with Huawei Watch Fit 4',
      price: 670.00,
      originalPrice: 129.99,
      images: ['../../assets/band cover.jpg'],
      category: 'Audio',
      brand: 'SoundWave',
      rating: 4.5,
      reviewCount: 1580,
      relatedProducts: [ 2, 1],
      inStock: true,
      features: ['360° Sound', 'Waterproof', '20-hour Battery', 'Voice Assistant'],
      specifications: {
        'Battery Life': '20 hours',
        'Water Rating': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Output Power': '25W'
      }
    },
  ];

  constructor() {
    this.productsSubject.next(this.mockProducts);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.mockProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
    return of(filtered);
  }

  // getRecommendedProducts(currentProductId?: string): Observable<Product[]> { debugger
  //   let recommendations = [...this.mockProducts];
  //   if (currentProductId) {
  //     recommendations = recommendations.filter(p => p.id !== currentProductId);
  //   }
  //   return of(recommendations.slice(0, 4));
  // }

 getRecommendedProducts(currentProductId?: string): Observable<Product[]> {
  let recommendations: Product[] = [];

  if (currentProductId) {
    // find the current product
    const currentProduct = this.mockProducts.find(p => p.id === currentProductId);

    if (currentProduct && currentProduct.relatedProducts?.length) {
      // map related product IDs to actual products
      recommendations = currentProduct.relatedProducts
        .map((relatedId :any)=> this.mockProducts.find(p => p.id === String(relatedId)))
        .filter((p:any): p is Product => !!p); // keep only valid products
    }
  }

  // if no relatedProducts found, fallback to generic 4 (excluding current)
  if (recommendations.length === 0) {
    recommendations = this.mockProducts
      .filter(p => p.id !== currentProductId)
      .slice(0, 4);
  }

  return of(recommendations);
}



  searchProducts(query: string): Observable<Product[]> { debugger 
    return this.getProducts().pipe(
      map((products: any) => {
        const queryLower = query.toLowerCase();
        return products.filter((p: any) => 
          p.name.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower) ||
          (p.features && p.features.some((f: string) => f.toLowerCase().includes(queryLower))) ||
          (p.specifications && Object.values(p.specifications).some((spec: any) => 
            spec.toLowerCase().includes(queryLower)
          ))
        );
      })
    );
  }

  getProductById(productId: string): Observable<Product> {
    const product = this.mockProducts.find((p:any) => p.id === productId);
    return of(product as Product);
  }
 filterConceptsFuzzy(query: string): any[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const queryWords = lowerQuery.split(/\s+/);

  return this.aiConcepts.filter((concept :any)=> {
    const searchableText = [
      concept.name,
      concept.definition,
      ...concept.examples
    ]
      .join(" ")
      .toLowerCase();

    return queryWords.some(word => searchableText.includes(word));
  });
}





}
