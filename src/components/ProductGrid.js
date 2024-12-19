import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProducts();
        setProducts(data);
        const uniqueCategories = ['all', ...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Nie udało się załadować produktów');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'Wszystkie' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
            aria-label={`Dodaj ${product.name} do koszyka`}
            disabled={product.stock === 0}
          >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-blue-600 font-bold">
                {product.price.toFixed(2)} zł
              </p>
              <span className={`text-sm ${
                product.stock > 10 
                  ? 'text-green-500' 
                  : product.stock > 0 
                    ? 'text-orange-500' 
                    : 'text-red-500'
              }`}>
                {product.stock > 0 ? `Dostępne: ${product.stock}` : 'Brak w magazynie'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 