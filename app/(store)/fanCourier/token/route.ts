import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { saveTokenToDatabase } from '@/sanity/lib/tokenOperations/tokenOperations';

const CRON_SECRET = process.env.CRON_SECRET;

// Define interfaces for the API response
interface FanCourierTokenData {
  token: string;
  expires_at: string;  // Snake case as received from API
}

interface FanCourierSuccessResponse {
  status: 'success';
  data: FanCourierTokenData;
}

interface FanCourierErrorResponse {
  status: 'error';
  message: string;
}

// Interface for our database schema
interface DatabaseTokenData {
  token: string;
  expiresAt: string;  // Camel case as expected by database
}

type FanCourierResponse = FanCourierSuccessResponse | FanCourierErrorResponse;

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

    const data = await response.json() as FanCourierResponse;

    if (data.status === 'success') {
      // Transform the data to match our database schema
      const databaseData: DatabaseTokenData = {
        token: data.data.token,
        expiresAt: data.data.expires_at
      };

      // Salvăm token-ul în Sanity
      await saveTokenToDatabase(databaseData);
      return { success: true, message: 'Token updated successfully' };
    } else {
      throw new Error(data.message || 'Failed to get token');
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: errorMessage });
  }
}