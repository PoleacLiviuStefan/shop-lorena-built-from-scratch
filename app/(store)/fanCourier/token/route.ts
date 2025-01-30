import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await fetchAndSaveToken();
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}