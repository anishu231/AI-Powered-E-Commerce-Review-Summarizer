export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Artisan Leather Tote",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Handcrafted from premium full-grain leather, this spacious tote features a timeless design with modern functionality. Perfect for work or weekend adventures, it includes interior pockets for organization and a durable brass zipper closure.",
    reviews: [
      { id: "1a", reviewerName: "Sarah M.", rating: 5, comment: "Absolutely stunning bag! The leather quality is exceptional and it fits everything I need for work.", date: "2024-01-15" },
      { id: "1b", reviewerName: "James K.", rating: 4, comment: "Great bag, well made. Wish it had a shoulder strap option.", date: "2024-01-10" },
      { id: "1c", reviewerName: "Elena R.", rating: 5, comment: "Worth every penny. Gets compliments everywhere I go.", date: "2024-01-05" },
      { id: "1d", reviewerName: "Michael T.", rating: 5, comment: "Bought this for my wife and she loves it. Premium quality.", date: "2023-12-28" },
      { id: "1e", reviewerName: "Lisa P.", rating: 4, comment: "Beautiful craftsmanship. Slightly heavier than expected.", date: "2023-12-20" },
    ]
  },
  {
    id: "2",
    name: "Minimalist Watch",
    price: 245.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    description: "A sleek timepiece featuring a Japanese quartz movement, scratch-resistant sapphire crystal, and a genuine leather strap. The clean dial design emphasizes readability while maintaining understated elegance.",
    reviews: [
      { id: "2a", reviewerName: "David L.", rating: 5, comment: "Exactly what I was looking for. Simple, elegant, and well-made.", date: "2024-01-18" },
      { id: "2b", reviewerName: "Anna S.", rating: 5, comment: "The perfect everyday watch. Love the minimalist design.", date: "2024-01-12" },
      { id: "2c", reviewerName: "Tom H.", rating: 4, comment: "Great watch for the price. Strap could be softer.", date: "2024-01-08" },
      { id: "2d", reviewerName: "Rachel W.", rating: 5, comment: "Gifted this to my husband and he wears it daily.", date: "2024-01-02" },
      { id: "2e", reviewerName: "Chris B.", rating: 3, comment: "Nice design but arrived with a scratch on the case.", date: "2023-12-25" },
      { id: "2f", reviewerName: "Michelle D.", rating: 5, comment: "Stunning simplicity. Goes with everything!", date: "2023-12-18" },
    ]
  },
  {
    id: "3",
    name: "Wireless Noise-Canceling Headphones",
    price: 329.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    description: "Experience immersive sound with adaptive noise cancellation, 30-hour battery life, and premium memory foam cushions. Features include touch controls, multipoint connection, and a foldable design for portability.",
    reviews: [
      { id: "3a", reviewerName: "Kevin M.", rating: 5, comment: "Best headphones I've ever owned. The noise cancellation is incredible.", date: "2024-01-20" },
      { id: "3b", reviewerName: "Jessica F.", rating: 5, comment: "So comfortable for long work sessions. Sound quality is amazing.", date: "2024-01-16" },
      { id: "3c", reviewerName: "Ryan T.", rating: 4, comment: "Great sound but the app could use some improvements.", date: "2024-01-11" },
      { id: "3d", reviewerName: "Nicole A.", rating: 5, comment: "Perfect for my commute. Battery lasts forever!", date: "2024-01-06" },
      { id: "3e", reviewerName: "Brandon S.", rating: 4, comment: "Excellent product. Just wish they came in more colors.", date: "2023-12-30" },
      { id: "3f", reviewerName: "Amanda C.", rating: 5, comment: "Worth the investment. Use them every single day.", date: "2023-12-22" },
      { id: "3g", reviewerName: "Derek J.", rating: 3, comment: "Good headphones but they press on my ears after a few hours.", date: "2023-12-15" },
    ]
  },
  {
    id: "4",
    name: "Organic Cotton Blanket",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
    description: "Woven from 100% GOTS-certified organic cotton, this breathable blanket offers year-round comfort. Features a classic herringbone pattern and finished edges that become softer with every wash.",
    reviews: [
      { id: "4a", reviewerName: "Emily R.", rating: 5, comment: "So soft and cozy! Perfect weight for all seasons.", date: "2024-01-19" },
      { id: "4b", reviewerName: "John D.", rating: 5, comment: "Great quality blanket. Love that it's organic.", date: "2024-01-14" },
      { id: "4c", reviewerName: "Sophie L.", rating: 4, comment: "Beautiful blanket but took a while to ship.", date: "2024-01-09" },
      { id: "4d", reviewerName: "Mark H.", rating: 5, comment: "Bought two more after trying the first one. Amazing!", date: "2024-01-03" },
      { id: "4e", reviewerName: "Kate M.", rating: 4, comment: "Lovely texture. Slightly smaller than I expected.", date: "2023-12-27" },
    ]
  },
  {
    id: "5",
    name: "Ceramic Pour-Over Set",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Handmade ceramic dripper and carafe set for the perfect cup of coffee. Features a unique spiral ribbed interior for optimal extraction and includes a reusable stainless steel filter.",
    reviews: [
      { id: "5a", reviewerName: "Coffee_Lover", rating: 5, comment: "Makes the best pour-over I've had at home. Beautiful design too.", date: "2024-01-17" },
      { id: "5b", reviewerName: "Greg N.", rating: 4, comment: "Great set. The ceramic holds heat well.", date: "2024-01-13" },
      { id: "5c", reviewerName: "Maria V.", rating: 5, comment: "A coffee ritual game-changer. Highly recommend!", date: "2024-01-07" },
      { id: "5d", reviewerName: "Paul K.", rating: 5, comment: "Perfect gift for any coffee enthusiast.", date: "2024-01-01" },
      { id: "5e", reviewerName: "Linda B.", rating: 3, comment: "Nice product but the filter clogs easily.", date: "2023-12-24" },
      { id: "5f", reviewerName: "Steve R.", rating: 4, comment: "Beautiful craftsmanship. Coffee tastes noticeably better.", date: "2023-12-17" },
    ]
  },
  {
    id: "6",
    name: "Bamboo Desk Organizer",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
    description: "Sustainable bamboo organizer with compartments for pens, devices, and accessories. Features a built-in phone stand and wireless charging pad compatibility. Clean up your workspace in style.",
    reviews: [
      { id: "6a", reviewerName: "Office_Pro", rating: 5, comment: "Finally, a desk organizer that looks good and works well!", date: "2024-01-21" },
      { id: "6b", reviewerName: "Wendy T.", rating: 4, comment: "Sturdy and attractive. Helped declutter my desk.", date: "2024-01-15" },
      { id: "6c", reviewerName: "Frank M.", rating: 5, comment: "High quality bamboo. Very satisfied with this purchase.", date: "2024-01-10" },
      { id: "6d", reviewerName: "Diana S.", rating: 4, comment: "Nice organizer. Some compartments are a bit small.", date: "2024-01-04" },
      { id: "6e", reviewerName: "Alex P.", rating: 5, comment: "Eco-friendly and functional. What's not to love?", date: "2023-12-29" },
    ]
  },
  {
    id: "7",
    name: "Merino Wool Scarf",
    price: 78.00,
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=600&fit=crop",
    description: "Ultra-soft merino wool scarf that regulates temperature naturally. Lightweight yet warm, it features a subtle heathered texture and hand-rolled edges. Perfect for layering in any season.",
    reviews: [
      { id: "7a", reviewerName: "Winter_Style", rating: 5, comment: "The softest scarf I own. No itching at all!", date: "2024-01-18" },
      { id: "7b", reviewerName: "Martha L.", rating: 5, comment: "Beautiful quality. Keeps me warm without being bulky.", date: "2024-01-12" },
      { id: "7c", reviewerName: "Robert C.", rating: 4, comment: "Great scarf. Color was slightly different from the photo.", date: "2024-01-06" },
      { id: "7d", reviewerName: "Susan H.", rating: 5, comment: "Worth the splurge. Feels luxurious.", date: "2024-01-01" },
      { id: "7e", reviewerName: "Tony G.", rating: 4, comment: "Soft and warm. A bit pricey but good quality.", date: "2023-12-26" },
      { id: "7f", reviewerName: "Claire W.", rating: 5, comment: "Perfect gift! My mom absolutely loved it.", date: "2023-12-19" },
    ]
  },
  {
    id: "8",
    name: "Portable Bluetooth Speaker",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    description: "Compact waterproof speaker with 360° sound, 20-hour playtime, and built-in microphone. Features include stereo pairing, USB-C charging, and a carabiner clip for outdoor adventures.",
    reviews: [
      { id: "8a", reviewerName: "Music_Fan", rating: 5, comment: "Incredible sound for such a small speaker. Perfect for camping!", date: "2024-01-19" },
      { id: "8b", reviewerName: "Jason L.", rating: 4, comment: "Great sound quality. Bass could be deeper.", date: "2024-01-14" },
      { id: "8c", reviewerName: "Amy R.", rating: 5, comment: "Survived a day at the beach with no issues. Love it!", date: "2024-01-08" },
      { id: "8d", reviewerName: "Daniel K.", rating: 5, comment: "Battery life is amazing. Use it every day.", date: "2024-01-02" },
      { id: "8e", reviewerName: "Patricia M.", rating: 4, comment: "Compact and powerful. Wish it was a bit louder.", date: "2023-12-28" },
      { id: "8f", reviewerName: "George B.", rating: 3, comment: "Good speaker but the app is buggy.", date: "2023-12-21" },
    ]
  },
  {
    id: "9",
    name: "Handcrafted Soy Candle Set",
    price: 42.00,
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    description: "Set of three hand-poured soy candles with essential oil fragrances: lavender, eucalyptus, and vanilla. Made with 100% natural soy wax and cotton wicks for a clean, long-lasting burn.",
    reviews: [
      { id: "9a", reviewerName: "Candle_Queen", rating: 5, comment: "These smell absolutely divine! Burn evenly too.", date: "2024-01-20" },
      { id: "9b", reviewerName: "Monica F.", rating: 5, comment: "Love the natural scents. Not overpowering at all.", date: "2024-01-15" },
      { id: "9c", reviewerName: "Trevor H.", rating: 4, comment: "Nice candles. Lavender is my favorite.", date: "2024-01-09" },
      { id: "9d", reviewerName: "Rebecca N.", rating: 5, comment: "Perfect for creating a relaxing atmosphere.", date: "2024-01-04" },
      { id: "9e", reviewerName: "Howard J.", rating: 4, comment: "Good quality but burn time could be longer.", date: "2023-12-29" },
    ]
  },
  {
    id: "10",
    name: "Stainless Steel Water Bottle",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
    description: "Double-walled vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12. Features a leak-proof lid, wide mouth for easy cleaning, and a powder-coated finish for grip.",
    reviews: [
      { id: "10a", reviewerName: "Hydration_Hero", rating: 5, comment: "Keeps ice for a full day! Best water bottle I've had.", date: "2024-01-21" },
      { id: "10b", reviewerName: "Nancy K.", rating: 4, comment: "Great bottle. Wish the lid had a handle.", date: "2024-01-16" },
      { id: "10c", reviewerName: "Victor S.", rating: 5, comment: "Perfect size for my gym bag. Very durable.", date: "2024-01-11" },
      { id: "10d", reviewerName: "Beth A.", rating: 5, comment: "Love the matte finish. Doesn't sweat at all.", date: "2024-01-05" },
      { id: "10e", reviewerName: "Carl R.", rating: 4, comment: "Solid product. A bit heavy when full.", date: "2023-12-31" },
      { id: "10f", reviewerName: "Diane M.", rating: 5, comment: "Replaced all my plastic bottles with these!", date: "2023-12-23" },
    ]
  },
];
