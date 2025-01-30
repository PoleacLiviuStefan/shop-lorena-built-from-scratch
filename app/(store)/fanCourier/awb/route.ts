import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getTokenFromDatabase } from '@/sanity/lib/getTokenFromDatabase/getTokenFromDatabase';

export async function POST(req: NextRequest) {
  try {
    // Obține token-ul Fan Courier
    let token;

    try {
      const tokenData = await getTokenFromDatabase();
      if (!tokenData?.token) {
        // Dacă nu există token în baza de date, obține unul nou
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

    // Obține datele din body-ul request-ului
    const body = await req.json();
    const { cart } = body;
    console.log('Cart:', cart);
    if (!cart || !cart.shipping_address) {
      throw new Error("Informații incomplete despre coș sau adresa de livrare.");
    }

    // Structura corectă pentru detaliile AWB
    const awbDetails = {
      clientId: process.env.FAN_COURIER_CLIENT_ID,
      shipments: [{
        info: {
          service: "Standard",
          packages: { parcel: 0, envelope: 1 },
          weight: 1,
          payment: "recipient",
          observation: "Observație test",
          content: `Comanda ${cart.id}`,
          dimensions: { length: 10, height: 20, width: 30 },
          costCenter: "DEP IT",
          options: ["X"]
        },
        recipient: {
          name: `${cart.shipping_address.first_name ?? ""} ${cart.shipping_address.last_name ?? ""}`,
          phone: cart.shipping_address.phone ?? "",
          email: cart.shipping_address.email ?? "test@example.com",
          address: {
            county: cart.shipping_address.province ?? "",
            locality: cart.shipping_address.city ?? "",
            street: cart.shipping_address.address_1 ?? "",
            streetNo: cart.shipping_address.address_2 ?? "",
            zipCode: cart.shipping_address.postal_code ?? ""
          }
        }
      }]
    };

    // Validare câmpuri necesare
    const requiredFields = [
      awbDetails.shipments[0].info.service,
      awbDetails.shipments[0].info.weight,
      awbDetails.shipments[0].info.payment,
      awbDetails.shipments[0].recipient.name,
      awbDetails.shipments[0].recipient.phone,
      awbDetails.shipments[0].recipient.address.county,
      awbDetails.shipments[0].recipient.address.locality,
      awbDetails.shipments[0].recipient.address.street,
    ];

    if (requiredFields.some((field) => !field)) {
      throw new Error("Datele pentru AWB sunt incomplete.");
    }
    console.log("awb details sunt: ", awbDetails);
    
    // Trimitere request către API Fan Courier
    const response = await axios.post("https://api.fancourier.ro/intern-awb", awbDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;
    console.log("apiResponse", apiResponse);
    if (!apiResponse || !apiResponse.response || apiResponse.response[0].awbNumber === null) {
      console.error("Erori primite:", apiResponse?.response[0].errors);
      throw new Error("Generare AWB eșuată. Verificați detaliile trimise.");
    }

    return NextResponse.json({
      status: "success",
      awbNumber: apiResponse.response[0].awbNumber,
    });
  } catch (error: unknown) {  // Changed from string | null to unknown
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorDetails = axios.isAxiosError(error) ? error.response?.data : null;
    
    console.error("Eroare:", errorMessage);
    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}