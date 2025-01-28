// /api/products.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow GET requests for public API
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        // Add any other public fields you want to expose
      },
      orderBy: {
        id: 'desc'
      }
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Public API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  } finally {
    await prisma.$disconnect();
  }
}