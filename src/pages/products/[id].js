// src/pages/products/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Admin/Layout';
import ProtectedRoute from '@/components/Admin/Auth/ProtectedRoute';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <div className="relative h-64 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl text-indigo-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-6">{product.description}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Back to Products
                </button>
                <button
                  onClick={() => router.push(`/admin/products?edit=${product.id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProductDetailPage;