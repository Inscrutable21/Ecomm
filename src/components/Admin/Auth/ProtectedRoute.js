import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/admin/login');
      }
    };

    checkSession();
  }, [router]);

  return children;
}