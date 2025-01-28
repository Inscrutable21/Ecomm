import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Admin/Layout';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { parse } from 'papaparse';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]); // List of available products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sales data from localStorage on initial load
  const [todaySales, setTodaySales] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTodaySales = localStorage.getItem('todaySales');
      return savedTodaySales ? JSON.parse(savedTodaySales) : [];
    }
    return [];
  });

  const [monthlySales, setMonthlySales] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMonthlySales = localStorage.getItem('monthlySales');
      return savedMonthlySales ? JSON.parse(savedMonthlySales) : [];
    }
    return [];
  });

  const [overallSales, setOverallSales] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedOverallSales = localStorage.getItem('overallSales');
      return savedOverallSales ? JSON.parse(savedOverallSales) : [];
    }
    return [];
  });

  // Save sales data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todaySales', JSON.stringify(todaySales));
    }
  }, [todaySales]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlySales', JSON.stringify(monthlySales));
    }
  }, [monthlySales]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('overallSales', JSON.stringify(overallSales));
    }
  }, [overallSales]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch('/api/admin/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add a product to today's sales
  const handleProductSelection = (product, quantity) => {
    const newSale = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity || 1, // Default to 1 if quantity is not provided
      date: new Date().toISOString(), // Timestamp for the sale
    };

    // Add to today's sales
    setTodaySales((prev) => [...prev, newSale]);

    // Add to monthly sales
    setMonthlySales((prev) => [...prev, newSale]);

    // Add to overall sales
    setOverallSales((prev) => [...prev, newSale]);
  };

  // Calculate total revenue for a given sales array
  const calculateRevenue = (sales) => {
    return sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0);
  };

  // Generate daily sales report
  const generateDailyReport = () => {
    const totalAmount = calculateRevenue(todaySales);
    alert(`Total amount sold today: $${totalAmount.toFixed(2)}`);
  };

  // Export today's sales as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Sales Report', 10, 10);
    todaySales.forEach((sale, index) => {
      doc.text(
        `${sale.name} - Quantity: ${sale.quantity} - Price: $${sale.price.toFixed(2)}`,
        10,
        20 + index * 10
      );
    });
    doc.text(`Total Revenue: $${calculateRevenue(todaySales).toFixed(2)}`, 10, 20 + todaySales.length * 10);
    doc.save('daily_sales_report.pdf');
  };

  // Export today's sales as CSV
  const exportToCSV = () => {
    const csvData = todaySales.map((sale) => ({
      Name: sale.name,
      Quantity: sale.quantity,
      Price: `$${sale.price.toFixed(2)}`,
    }));
    const csv = parse(csvData, { header: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'daily_sales_report.csv');
  };

  // Reset today's sales at midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to next midnight
    const timeUntilMidnight = midnight - now;

    const resetTimer = setTimeout(() => {
      setTodaySales([]); // Reset today's sales
    }, timeUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, [todaySales]);

  // Reset monthly sales at the end of the month
  useEffect(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999); // Set to end of the month
    const timeUntilEndOfMonth = endOfMonth - now;

    const resetTimer = setTimeout(() => {
      setMonthlySales([]); // Reset monthly sales
    }, timeUntilEndOfMonth);

    return () => clearTimeout(resetTimer);
  }, [monthlySales]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {session?.user?.email}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Today&apos;s Revenue</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${calculateRevenue(todaySales).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Monthly Revenue</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${calculateRevenue(monthlySales).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Overall Revenue</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${calculateRevenue(overallSales).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Daily Sales Report Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Report</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Select products sold today:</p>
              <div className="space-x-2">
                <button
                  onClick={generateDailyReport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Export as PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export as CSV
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Display products */}
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                  <p className="text-sm text-gray-500">Price: ${product.price.toFixed(2)}</p>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value, 10);
                      handleProductSelection(product, quantity);
                    }}
                  />
                  <button
                    onClick={() => handleProductSelection(product)}
                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}