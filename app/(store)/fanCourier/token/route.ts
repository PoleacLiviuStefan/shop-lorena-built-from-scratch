// pages/api/cron.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { saveTokenToDatabase } from '@/sanity/lib/tokenOperations/tokenOperations';

const CRON_SECRET = process.env.CRON_SECRET;

async function fetchAndSaveToken() {
  try {
    const response = await fetch('https://api.fancourier.ro/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.FAN_COURIER_USERNAME,
        password: process.env.FAN_COURIER_PASSWORD,
      }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      // Salvăm token-ul în Sanity
      await saveTokenToDatabase(data.data);
      return { success: true, message: 'Token updated successfully' };
    } else {
      throw new Error('Failed to get token');
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authorization } = req.headers;
  if (authorization !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await fetchAndSaveToken();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}