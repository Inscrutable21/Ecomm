import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="font-semibold text-lg text-blue-600">
            ${product.price}
          </p>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <button className="w-full mt-4 bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white 
          rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300
          group/btn"
        >
          <ShoppingCart className="w-5 h-5 transform group-hover/btn:scale-110 transition-transform" />
          <span className="font-medium">Add to Cart</span>
        </button>
      </div>

      {/* Category Tag */}
      {product.category && (
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-sm 
          font-medium text-gray-700 rounded-full">
          {product.category}
        </span>
      )}
    </div>
  );
};

export default ProductCard;