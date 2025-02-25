"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { createCheckoutSessionCourse } from "@/app/actions/createCheckoutSessionCourse";
import online from "../public/Imagini/cursuri/online.jpg";
import Image from "next/image";
import { useState } from "react";

interface OnlineCourseClientProps {
  hasAccess: boolean;
  // hasBonusAccess: boolean;
}

const CourseContent = () => (
  <div className="flex flex-col items-center min-h-screen w-full max-w-4xl px-4">
    <iframe
      src="https://www.youtube.com/embed/qv1IN-bxq58?rel=0&modestbranding=1"
      className="w-full h-[500px]"
      frameBorder="0"
      allowFullScreen
    ></iframe>

   
      <a
        href="/Imagini/cursuri/bonus.pdf"
        download
        className="inline-flex items-center px-4 py-2 mt-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Descarcă 7 zile de promovare Feline Effect Challenge
      </a>
    
  </div>
);

export default function OnlineCourseClient({
  hasAccess = false,
  // hasBonusAccess = false,
}: OnlineCourseClientProps) {
  const { userId } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      const checkoutUrl = await createCheckoutSessionCourse();

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const handleCodeSubmit = async () => {
    if (!accessCode || !userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/validate-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: accessCode,
            userId: userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("Cod validat cu succes!");
      // Refresh page to update access
      window.location.reload();
    } catch (error) {
      console.log(
        error instanceof Error ? error.message : "Eroare la validarea codului"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {hasAccess ? (
        <CourseContent  />
      ) : (
        <div className="flex flex-col items-center min-h-screen">
          <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-6 mt-8 px-4">
            <div className="flex flex-col items-center">
              <Image
                alt="CURS ONLINE FELINE EFFECT"
                src={online}
                className="w-full lg:w-[400px]"
              />
              <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-[400px]">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <span className="text-xl lg:text-3xl font-bold">499 RON</span>
                  <span className="text-gray-500 line-through">998 RON</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Reducere 50%
                  </span>
                </div>

                {!userId ? (
                  <SignInButton mode="modal">
                    <Button>
                      Autentifică-te pentru a putea achiziționa sau valida
                    </Button>
                  </SignInButton>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <input
                        className="border-[1px] border-black w-full p-1 text-center"
                        type="text"
                        placeholder="Introdu codul de acces"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                      />
                      <Button
                        onClick={handleCodeSubmit}
                        disabled={isLoading || !accessCode}
                        className="w-full"
                        variant="outline"
                      >
                        {isLoading ? "Se validează..." : "Validează Codul"}
                      </Button>
                    </div>
                    <Button
                      onClick={handlePurchase}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      Comandă Acum
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 w-full">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">✨ Acces Permanent</h4>
                  <p className="text-sm text-gray-600">
                    Revezi materialul oricând dorești
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-2xl text-center space-y-4">
              <h3 className="text-2xl font-bold mb-4">

                CURS ONLINE FELINE EFFECT – REDUCERE 50% PÂNĂ DUMINICĂ

              </h3>
              <p className="text-gray-600">
                În primul rând, felicitări pentru că ai ajuns aici pe pagină, ceea ce înseamnă că îți dorești
                EVOLUȚIE și ai venit la locul potrivit. Fie că îți dorești să îți mărești veniturile, să aduci ceva
                NOU clientelor tale sau pur și simplu ți-a plăcut efectul și vrei să îl înveți, eu sper ca din tot
                acest curs să nu rămâi doar cu tehnica, ci cu o amintire și o emoție. Pe tot parcursul cursului voi
                vorbi despre trăirile mele în această meserie, așa că abia aștept să-mi fii alături.
              </p>
              <h3 className="font-bold text-lg lg:text-xl">
                Ce subiecte dezbat?
              </h3>
              <ul className="text-gray-600 text-left">
                <li>ABSOLUT TOATE SECRETELE ACESTUI EFECT</li>
                <li>TEHNICA EVANTAI ÎNTR-O SECUNDĂ</li>
                <li>PROMOVARE, PROMOVARE, PROMOVARE, CHEIA SUCCESULUI</li>
                <li>TIMPUL, ÎN FAVOAREA TA</li>
                <li>TIPURI DE CLIENȚE ȘI CUM SĂ LE MULȚUMEȘTI</li>
                <li>PRODUSELE IDEALE</li>
                <li>DESPRE EVOLUȚIE ȘI COSTURILE EI</li>
                <li>CREȘTEM CIFRELE ÎN ONLINE</li>
                <li>CUM SĂ VINZI CEEA CE FACI</li>
                <li>ȘI ALTELE</li>
              </ul>
              <p className="text-gray-600">
                Te aștept pentru a trece la următorul nivel, cu EFECTE SPECIALE pentru cine dorește să VINDE și să-și
                mărească profitul. Toate acestea la pachet cu PROMOVAREA ta – nu uita că tu ești BRAND-ul tău, fii
                autentic, fii tu!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
