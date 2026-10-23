


// import { Link } from "react-router-dom";
// import { Star } from "lucide-react";
// import { ProductsProps } from "@/pages/Products";

// interface ProductCardProps {
//   product: ProductsProps;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   // 1. Reviews handle and fallback checking array protection
//   const totalReviews = product.reviews ? product.reviews.length : 0;
//   const avgRating = totalReviews > 0
//     ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
//     : 0;

//   // Local static SVG placeholder backup
//   const localPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%23' y='50%23' font-family='sans-serif' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>No Image Available</text></svg>";

//   // 2. IMAGE PATH HANDLER
//     // Is logic ko check karein aapke ProductCard.tsx ke andar:
//   const rawPath = product.imageUrl || product.image || product.image_url || "";
//   let absoluteImageUrl = "";

//   if (!rawPath || rawPath.includes("placeholder.jpg")) {
//     absoluteImageUrl = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='400' height='300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%23' y='50%23' font-family='sans-serif' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>No Image Available</text></svg>";
//   } else if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) {
//     absoluteImageUrl = rawPath;
//   } else {
//     // 🔥 Django local server media server path resolution mapping
//     const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
//     absoluteImageUrl = `http://localhost:8000${cleanPath}`;
//   }

//   // 🔥 3. STRICT FOOLPROOF SLUG GENERATOR (FIXED FOR UNDEFINED ERROR)
//   // Pehle check karega agar direct product.slug hai aur wo "undefined" text string nahi hai.
//   // Agar nahi hai, toh product.name se slug banayega. Agar name bhi nahi mila, toh id ko use karega.
//   let finalSlug = "";
  
//   if (product.slug && product.slug !== "undefined") {
//     finalSlug = product.slug;
//   } else if (product.name) {
//     finalSlug = product.name
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, '-')   // Special characters ko dashes se badla
//       .replace(/(^-|-$)+/g, '');      // Shuruat ya last ke extra dashes ko clear kiya
//   } else {
//     finalSlug = `item-${product.id}`;
//   }

//   return (
//     <Link
//       to={`/products/${finalSlug}`} // Ab yaha kabhi bhi "undefined" word nahi banta
//       className="group flex flex-col bg-background rounded-2xl overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300 animate-fade-in"
//     >
//       {/* Product Image Wrapper Frame */}
//       {/* <div className="relative aspect-[4/3] bg-muted overflow-hidden"> */}
//       <div className='bg-white aspect-[4/3] relative w-full overflow-hidden flex items-center justify-center p-3 border-b border-border/30'>
//         <img
//           src={absoluteImageUrl}
//           alt={product.name || "Product Image"}
//           loading="lazy"
//           // className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
//           className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             if (target.src !== localPlaceholder) {
//               target.src = localPlaceholder;
//             }
//           }}
//         />
//       </div>

//       {/* Content Meta Text Block */}
//       <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
//         <div>
//           <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition duration-150">
//             {product.name || "Untitled Product"}
//           </h3>
//         </div>

//         {/* Bottom Block containing Price & Ratings layout */}
//         <div className="flex items-center justify-between pt-1">
//           <span className="text-lg font-bold text-orange-600">
//             ${product.price ? Number(product.price).toFixed(2) : "0.00"}
//           </span>

//           <div className="flex items-center gap-0.5 text-orange-400">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={14}
//                 fill={i < Math.round(avgRating) ? "currentColor" : "none"}
//                 stroke={i < Math.round(avgRating) ? "none" : "currentColor"}
//                 className={i < Math.round(avgRating) ? "text-orange-400" : "text-muted-foreground/40"}
//               />
//             ))}
//             <span className="text-xs text-muted-foreground ml-1">
//               ({totalReviews})
//             </span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }



// import { Link } from "react-router-dom"; 
// import { Star } from "lucide-react"; 
// import { ProductsProps } from "@/pages/Products"; 

// interface ProductCardProps { 
//   product: ProductsProps; 
// } 

// export function ProductCard({ product }: ProductCardProps) { 
//   // 1. Reviews handle and fallback checking array protection 
//   const totalReviews = product.reviews ? product.reviews.length : 0; 
//   const avgRating = totalReviews > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0; 
  
//   // Local static SVG placeholder backup 
//   const localPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>No Image Available</text></svg>"; 
  
//   // 2. IMAGE PATH HANDLER 
//   const rawPath = product.imageUrl || product.image || product.image_url || ""; 
//   let absoluteImageUrl = ""; 
  
//   if (!rawPath || rawPath.includes("placeholder.jpg")) { 
//     absoluteImageUrl = localPlaceholder; 
//   } else if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) { 
//     absoluteImageUrl = rawPath; 
//   } else { 
//     // 🎯 FIXED IMAGE URL ROUTING ENGINE: Points directly to your successful live Render cloud server layout paths
//     const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`; 
//     absoluteImageUrl = `https://onrender.com${cleanPath}`; 
//   } 
  
//   // 3. STRICT FOOLPROOF SLUG GENERATOR
//   let finalSlug = ""; 
//   if (product.slug && product.slug !== "undefined") { 
//     finalSlug = product.slug; 
//   } else if (product.name) { 
//     finalSlug = product.name 
//       .toLowerCase() 
//       .trim() 
//       .replace(/[^a-z0-9]+/g, '-') 
//       .replace(/(^-|-$)+/g, ''); 
//   } else { 
//     finalSlug = `item-${product.id}`; 
//   } 
  
//   return ( 
//     <Link 
//       to={`/products/${finalSlug}`} 
//       className="group flex flex-col bg-background rounded-2xl overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300 animate-fade-in" 
//     > 
//       {/* Product Image Wrapper Frame */} 
//       <div className='bg-white aspect-[4/3] relative w-full overflow-hidden flex items-center justify-center p-3 border-b border-border/30'> 
//         <img 
//           src={absoluteImageUrl} 
//           alt={product.name || "Product Image"} 
//           loading="lazy" 
//           className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
//           onError={(e) => { 
//             const target = e.target as HTMLImageElement; 
//             if (target.src !== localPlaceholder) { 
//               target.src = localPlaceholder; 
//             } 
//           }} 
//         /> 
//       </div> 
      
//       {/* Content Meta Text Block */} 
//       <div className="p-5 flex flex-col justify-between flex-1 space-y-3"> 
//         <div> 
//           <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition duration-150"> 
//             {product.name || "Untitled Product"} 
//           </h3> 
//         </div> 
        
//         {/* Bottom Block containing Price & Ratings layout */} 
//         <div className="flex items-center justify-between pt-1"> 
//           <span className="text-lg font-bold text-orange-600"> 
//             ${product.price ? Number(product.price).toFixed(2) : "0.00"} 
//           </span> 
//           <div className="flex items-center gap-0.5 text-orange-400"> 
//             {[...Array(5)].map((_, i) => ( 
//               <Star 
//                 key={i} 
//                 size={14} 
//                 fill={i < Math.round(avgRating) ? "currentColor" : "none"} 
//                 stroke={i < Math.round(avgRating) ? "none" : "currentColor"} 
//                 className={i < Math.round(avgRating) ? "text-orange-400" : "text-muted-foreground/40"} 
//               /> 
//             ))} 
//             <span className="text-xs text-muted-foreground ml-1"> ({totalReviews}) </span> 
//           </div> 
//         </div> 
//       </div> 
//     </Link> 
//   ); 
// }



import { Link } from "react-router-dom"; 
import { Star } from "lucide-react"; 
import { ProductsProps } from "@/pages/Products"; 

interface ProductCardProps { 
  product: ProductsProps; 
} 

export function ProductCard({ product }: ProductCardProps) { 
  // 1. Reviews handle and fallback checking array protection 
  const totalReviews = product.reviews ? product.reviews.length : 0; 
  const avgRating = totalReviews > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0; 
  
  // Local static SVG placeholder backup 
  const localPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>No Image Available</text></svg>"; 
  
  // 2. IMAGE PATH HANDLER WITH CLOUDINARY CLEANUP ENGINE
  let rawPath = product.imageUrl || product.image || product.image_url || ""; 
  let absoluteImageUrl = ""; 
  
  if (typeof rawPath === "string") {
    // 💡 FIX 1: Agar path me Django local media ya render link galti se duplicate inject ho gaya ho, 
    // toh use filter karke direct clean Cloudinary link nikal lega.
    if (rawPath.includes("https://cloudinary.com")) {
      const index = rawPath.indexOf("https://cloudinary.com");
      rawPath = rawPath.substring(index);
    } else if (rawPath.includes("http://cloudinary.com")) {
      const index = rawPath.indexOf("http://cloudinary.com");
      rawPath = rawPath.substring(index);
    }
  }

  if (!rawPath || rawPath.includes("placeholder.jpg")) { 
    absoluteImageUrl = localPlaceholder; 
  } else if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) { 
    absoluteImageUrl = rawPath; 
  } else { 
    // 💡 FIX 2: Aapka original complete project name aur sub-domain sahi format me map kiya hai
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`; 
    absoluteImageUrl = `https://ai-powered-e-commerce-review-summarizer.onrender.com${cleanPath}`; 
  } 
  
  // 3. STRICT FOOLPROOF SLUG GENERATOR 
  let finalSlug = ""; 
  if (product.slug && product.slug !== "undefined") { 
    finalSlug = product.slug; 
  } else if (product.name) { 
    finalSlug = product.name 
      .toLowerCase() 
      .trim() 
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/(^-|-$)+/g, ''); 
  } else { 
    finalSlug = `item-${product.id}`; 
  } 
  
  return ( 
    <Link 
      to={`/products/${finalSlug}`} 
      className="group flex flex-col bg-background rounded-2xl overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300 animate-fade-in" 
    > 
      {/* Product Image Wrapper Frame */} 
      <div className='bg-white aspect-[4/3] relative w-full overflow-hidden flex items-center justify-center p-3 border-b border-border/30'> 
        <img 
          src={absoluteImageUrl} 
          alt={product.name || "Product Image"} 
          loading="lazy" 
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
          onError={(e) => { 
            const target = e.target as HTMLImageElement; 
            if (target.src !== localPlaceholder) { 
              target.src = localPlaceholder; 
            } 
          }} 
        /> 
      </div> 
      
      {/* Content Meta Text Block */} 
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3"> 
        <div> 
          <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition duration-150"> 
            {product.name || "Untitled Product"} 
          </h3> 
        </div> 
        
        {/* Bottom Block containing Price & Ratings layout */} 
        <div className="flex items-center justify-between pt-1"> 
          <span className="text-lg font-bold text-orange-600"> 
            ${product.price ? Number(product.price).toFixed(2) : "0.00"} 
          </span> 
          <div className="flex items-center gap-0.5 text-orange-400"> 
            {[...Array(5)].map((_, i) => ( 
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.round(avgRating) ? "currentColor" : "none"} 
                stroke={i < Math.round(avgRating) ? "none" : "currentColor"} 
                className={i < Math.round(avgRating) ? "text-orange-400" : "text-muted-foreground/40"} 
              /> 
            ))} 
            <span className="text-xs text-muted-foreground ml-1"> ({totalReviews}) </span> 
          </div> 
        </div> 
      </div> 
    </Link> 
  ); 
}

