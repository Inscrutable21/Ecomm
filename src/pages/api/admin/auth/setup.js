import prisma from '@/utils/db'
import { hashPassword } from '@/utils/auth/password'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    // Verify MongoDB connection
    await prisma.$connect()
    
    if (req.method !== 'POST') {
      return res.status(405).json({
        statusCode: 405,
        message: 'Method Not Allowed'
      })
    }

    const existingAdmin = await prisma.admin.findFirst()
    if (existingAdmin) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Admin already exists'
      })
    }

    const hashedPassword = await hashPassword(process.env.ADMIN_INITIAL_PASSWORD)
    
    const newAdmin = await prisma.admin.create({
      data: {
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      }
    })

    return res.status(201).json({
      statusCode: 201,
      message: 'Admin created successfully',
      data: {
        id: newAdmin.id,
        email: newAdmin.email
      }
    })

  } catch (error) {
    console.error('MongoDB Error:', error)
    return res.status(500).json({
      statusCode: 500,
      message: 'Database connection failed',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
}