'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<{
    clientName: string;
    clientEmail: string;
    uniqueCode: string;
    address: {
      judet: string;
      localitate: string;
      strada: string;
      detalii_adresa?: string; // Opțional
    };
  } | null>(null);

  const sendEmail = async ({
    clientEmail,
    clientName,
    uniqueCode,
    address
  }: {
    clientEmail: string;
    clientName: string;
    uniqueCode: string;
    address: {
      judet: string;
      localitate: string;
      detalii_adresa?: string; // Opțional
    };
  }) => {
    emailjs
    .send(
      'service_e9isnzl', // ID-ul serviciului
      'template_eifbiai', // ID-ul șablonului
      {
        client_email: clientEmail,
        client_name: clientName,
        course_code: uniqueCode,
        client_province: address.judet, // Trimite județul
        client_locality: address.localitate, // Trimite localitatea
        client_address: address.detalii_adresa, // Trimite detaliile opționale
        
      },
      'JBlV6SrZcJJiJKOe2' // Cheia publică
    )
    .then(
      (result) => {
        console.log('Email trimis cu succes!', result.text);

        // Actualizează `sessionStorage` pentru a indica că emailul a fost trimis
      },
      (error) => {
        console.log('Eroare la trimiterea emailului:', error.text);
      }
    );

    emailjs
    .send(
      'lorenadanoiu', // ID-ul serviciului
      'template_r00roqd', // ID-ul șablonului
      {
        client_email: clientEmail,
        client_name: clientName,
        course_code: uniqueCode,
      },
      'jkddlsCqSLugxlMFY' // Cheia publică
    )
    .then(
      (result) => {
        console.log('Email trimis cu succes!', result.text);

      },
      (error) => {
        console.log('Eroare la trimiterea emailului:', error.text);
      }
    );
  };

  const mapCustomFieldsToAddress = (customFields: {
    key: string;
    text: {
      value: string;
    };
   }[]): {
    judet: string;
    localitate: string;
    detalii_adresa?: string;
   } => {
    return {
      judet: customFields.find((field) => field.key === 'judet')?.text?.value || 'N/A',
      localitate: customFields.find((field) => field.key === 'localitate')?.text?.value || 'N/A',
      detalii_adresa: customFields.find((field) => field.key === 'detalii_adresa')?.text?.value || '',
    };
   };


  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      if (sessionStorage.getItem(`emailSent-${sessionId}`)) {
        console.log('Emailurile au fost deja trimise pentru această sesiune.');
        return;
      }
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();

        console.log('Custom fields:', data.custom_fields); // Log pentru debugging
        console.log('data este: ', data);
        const address = mapCustomFieldsToAddress(data.customFields || []);
        setOrderDetails({
          clientName: data.clientName || 'N/A',
          clientEmail: data.clientEmail || 'N/A',
          uniqueCode: data.uniqueCode,
          address: data.customFields
        });

        // Trimite emailul după ce datele sunt preluate
        await sendEmail({
          clientEmail: data.clientEmail,
          clientName: data.clientName,
          uniqueCode: data.uniqueCode,
          address
        });
        sessionStorage.setItem(`emailSent-${sessionId}`, 'true');
      } catch (error) {
        console.error('Eroare la obținerea detaliilor sesiunii:', error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-2">Plată reușită!</h1>
          <p className="text-gray-600">Mulțumim pentru achiziție. Detaliile comenzii tale sunt mai jos.</p>
        </div>

        {orderDetails ? (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-md">
              <h2 className="text-lg font-semibold text-green-700">Detalii comandă:</h2>
              <p className="text-gray-700">
                <strong>Nume:</strong> {orderDetails.clientName}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {orderDetails.clientEmail}
              </p>
              <p className="text-red-700">
                Salvează codul pentru a-l introduce atunci când se lansează cursul!
                <br />
                <strong>COD: {orderDetails.uniqueCode}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-gray-600">Se încarcă detaliile comenzii...</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/cursuri"
            className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500 transition"
          >
            Înapoi la cursuri
          </a>
        </div>
      </div>
    </div>
  );
}
