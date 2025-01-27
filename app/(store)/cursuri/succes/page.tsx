'use client'
import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

type EmailData = {
  user_nume: string;
  user_prenume: string;
  user_telefon: string;
  user_email: string;
  user_adresa: string;
  tip_curs: string;
  data_vip: string;
  mentiuni_speciale: string;
  message: string;
};

const Success: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const emailSentRef = useRef<boolean>(false); // Folosit pentru a preveni trimiterea multiplă

  useEffect(() => {
    // Verifică `sessionStorage` pentru a vedea dacă emailul a fost deja trimis
    const paymentStatus = sessionStorage.getItem('payment_intent');
    console.log('Payment status:', paymentStatus);
    if (paymentStatus === 'processing' && !emailSentRef.current) {
      emailSentRef.current = true; // Prevenim trimiterea multiplă
      sendEmail();
    }
  }, []);

  const sendEmail = () => {
    const emailData: EmailData = {
      user_nume: localStorage.getItem('user_nume') || '',
      user_prenume: localStorage.getItem('user_prenume') || '',
      user_telefon: localStorage.getItem('user_telefon') || '',
      user_email: localStorage.getItem('user_email') || '',
      user_adresa: localStorage.getItem('user_adresa') || '',
      tip_curs: localStorage.getItem('tip_curs') || '',
      data_vip: localStorage.getItem('data_vip') || '',
      mentiuni_speciale: localStorage.getItem('mentiuni_speciale') || '',
      message: 'Plata a fost efectuată cu succes!',
    };

    emailjs
      .send(
        'service_e9isnzl', // ID-ul serviciului
        'template_z9lx9pb', // ID-ul șablonului
        emailData,
        'JBlV6SrZcJJiJKOe2' // Cheia publică
      )
      .then(
        (result) => {
          console.log('Email trimis cu succes!', result.text);

          // Actualizează `sessionStorage` pentru a indica că emailul a fost trimis
          sessionStorage.setItem('payment_intent', 'sent');
          setEmailSent(true);
        },
        (error) => {
          console.log('Eroare la trimiterea emailului:', error.text);
        }
      );
  };

  if (emailSent)
    return (
      <div className="font-montSerrat w-full h-full flex flex-col items-center justify-center py-[10rem]">
        <h1 className="text-[28px] lg:text-[64px] text-center font-bold">
          OPERATIUNEA A AVUT LOC CU SUCCES
        </h1>
        <p className="lg:text-[20px] text-center">
          Multumim pentru comanda și <br /> te așteptăm la curs!
        </p>
      </div>
    );

  return null; // Poți returna un fallback dacă nu s-a trimis emailul
};

export default Success;
