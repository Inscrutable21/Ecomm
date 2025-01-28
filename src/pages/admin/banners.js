import ProtectedRoute from '@/components/Admin/Auth/ProtectedRoute';
import BannerForm from '@/components/Admin/BannerForm';
import BannerList from '@/components/Admin/BannerList';
import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';

function Banners() {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const response = await fetch('/api/admin/banners');
    const data = await response.json();
    setBanners(data);
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    await fetch('/api/admin/banners', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchBanners();
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
  };

  const handleSubmit = async (banner) => {
    setIsLoading(true);
    const url = editingBanner ? '/api/admin/banners' : '/api/admin/banners';
    const method = editingBanner ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      body: JSON.stringify(banner),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setEditingBanner(null);
    fetchBanners();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Banners
      </Typography>
      <BannerForm onSubmit={handleSubmit} initialData={editingBanner} isLoading={isLoading} />
      <BannerList banners={banners} onDelete={handleDelete} onEdit={handleEdit} />
    </Container>
  );
}

export default function BannersPage() {
  return (
    <ProtectedRoute>
      <Banners />
    </ProtectedRoute>
  );
}