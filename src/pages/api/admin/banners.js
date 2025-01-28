import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch all banners
    const banners = await prisma.banner.findMany();
    res.status(200).json(banners);
  } else if (req.method === 'POST') {
    // Create a new banner
    const { image } = req.body;
    const banner = await prisma.banner.create({
      data: { image },
    });
    res.status(201).json(banner);
  } else if (req.method === 'PUT') {
    // Update an existing banner
    const { id, image } = req.body;
    const banner = await prisma.banner.update({
      where: { id },
      data: { image },
    });
    res.status(200).json(banner);
  } else if (req.method === 'DELETE') {
    // Delete a banner
    const { id } = req.body;
    await prisma.banner.delete({
      where: { id },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}