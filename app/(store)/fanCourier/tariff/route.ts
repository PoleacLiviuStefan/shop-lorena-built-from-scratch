import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getTokenFromDatabase } from '@/sanity/lib/getTokenFromDatabase/getTokenFromDatabase';

export async function POST(req: NextRequest) {
  try {
    let token;

    try {
      const tokenData = await getTokenFromDatabase();
      if (!tokenData?.token) {
        // Dacă nu există token în Sanity, folosim un request direct la FanCourier
        const loginResponse = await axios.post('https://api.fancourier.ro/login', {
          username: process.env.FAN_COURIER_USERNAME,
          password: process.env.FAN_COURIER_PASSWORD
        });

        if (loginResponse.data?.data?.token) {
          token = loginResponse.data.data.token;
        } else {
          throw new Error('Nu s-a putut obține token-ul FanCourier');
        }
      } else {
        token = tokenData.token;
      }
    } catch (tokenError) {
      console.error('Error getting token:', tokenError);
      throw new Error('Eroare la autentificarea cu FanCourier');
    }

    const body = await req.json();
    const { tariffDetails } = body;

    const baseUrl = "https://api.fancourier.ro/reports/awb/internal-tariff";
    const queryParams = {
      ...tariffDetails,
      "info[service]": "Cont Colector",
      "info[payment]": "expeditor",
      "info[packages][envelope]": "1",
      "info[weight]": "1",
      "info[dimensions][length]": "20", // Lungimea coletului
      "info[dimensions][height]": "10", // Înălțimea coletului
      "info[dimensions][width]": "15", // Lățimea coletului
      clientId: process.env.FAN_COURIER_CLIENT_ID,
    };
    
    

    console.log("Requesting URL:", baseUrl);

    const response = await axios.get(baseUrl, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return NextResponse.json({
      status: "success",
      tariff: response.data.data,
    });
  } catch (error: any) {
    console.error(
      "Fan Courier API Error: ",
      error.response?.data || error.message
    );

    const errorMessage = error.message.includes('autentificare') || error.message.includes('token')
      ? 'Eroare de autentificare FanCourier. Vă rugăm încercați din nou.'
      : 'Calcularea tarifului a eșuat.';

    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
        error: error.response?.data || error.message,
      },
      { 
        status: error.message.includes('autentificare') || error.message.includes('token') 
          ? 401 
          : 500 
      }
    );
  }
}