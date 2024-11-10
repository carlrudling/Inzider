import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/database';
import Trip from '../../models/Trip';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'POST': {
      try {
        const { title, price, creator, days } = req.body;

        const newTrip = new Trip({
          title,
          price,
          creator,
          days, // Array of days with spots
        });

        await newTrip.save();
        return res.status(201).json(newTrip);
      } catch (error) {
        return res.status(400).json({ error: 'Error creating trip' });
      }
    }

    case 'PUT': {
      const { id } = req.query;
      const { days } = req.body;

      try {
        const trip = await Trip.findById(id);

        if (!trip) {
          return res.status(404).json({ error: 'Trip not found' });
        }

        trip.days = days; // Update the days with new spots
        await trip.save();

        return res.status(200).json(trip);
      } catch (error) {
        return res.status(400).json({ error: 'Error updating trip' });
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
