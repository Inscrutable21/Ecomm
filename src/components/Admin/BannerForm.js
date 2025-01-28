import { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

export default function BannerForm({ onSubmit, initialData, isLoading }) {
  const [banner, setBanner] = useState(initialData || { image: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(banner);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Banner' : 'Add Banner'}
      </Typography>
      <Grid container spacing={3}>
        {/* Image URL Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={banner.image}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}