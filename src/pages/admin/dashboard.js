import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Admin/Layout';


const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const response = await fetch('/api/admin/auth/verify');
      if (!response.ok) router.push('/admin/login');
    };
    verifySession();
  }, []);

  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      {/* Dashboard content */}
    </Layout>
  );
};

export default AdminDashboard;