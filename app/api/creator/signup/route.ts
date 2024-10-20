import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import Creator from '@/app/models/creator';
import dbConnect from '@/app/utils/database';

export default async function signupHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      // Ensure all fields are provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required' });
      }

      await dbConnect(); // Ensure database connection

      const existingUser = await Creator.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Creator({
        email,
        password: hashedPassword, // Save hashed password
        username: email.split('@')[0], // Example: create username based on email
      });

      await newUser.save();

      // Respond with user data (or any other necessary info)
      return res
        .status(201)
        .json({ message: 'User created successfully', newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
