// src/pages/api/admin/products.js
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(products);

      case 'POST':
        const { name, description, price, image } = req.body;
        
        if (!name || !description || !price || !image) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            image
          }
        });
        return res.status(201).json(newProduct);

      case 'PUT':
        const { id, ...updateData } = req.body;
        
        if (!id || !updateData) {
          return res.status(400).json({ error: 'Invalid request data' });
        }

        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            ...updateData,
            price: parseFloat(updateData.price)
          }
        });
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        const productId = req.body.id;
        
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        await prisma.product.delete({
          where: { id: productId }
        });
        return res.status(200).json({ message: 'Product deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Products API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}