import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BannerList({ banners, onDelete, onEdit }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Banners
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <img
                  src={banner.image}
                  alt="Banner"
                  style={{ width: '100px', height: 'auto' }}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(banner)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(banner.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}