'use client';

import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero/Hero";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { createCheckoutSessionCourse } from "@/app/actions/createCheckoutSessionCourse";


interface OnlineCourseClientProps {
  hasAccess: boolean;
}

const CourseContent = () => (
 <div className="flex flex-col items-center w-full max-w-4xl px-4">
   <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl">
     <video
       controls
       className="w-full h-full object-cover"
       controlsList="nodownload"
     >
       <source src="/Imagini/cursuri/cursVipVideo.mp4" type="video/mp4" />
       Browserul tău nu suportă elementul video.
     </video>
   </div>
   
   <div className="mt-8 prose prose-lg w-full">
     <h3 className="text-2xl font-bold">Descriere Curs</h3>
     <p>
       În acest curs vei învăța toate aspectele necesare pentru a deveni un specialist în extensii de gene,
       de la tehnici de bază până la cele mai avansate metode.
     </p>
     
     <h4 className="text-xl font-semibold mt-6">Ce vei învăța:</h4>
     <ul className="list-disc pl-6 space-y-2">
       <li>Pregătirea corectă a materialelor și instrumentelor</li>
       <li>Tehnici de aplicare pentru diferite stiluri</li>
       <li>Sfaturi pentru îngrijirea genelor după aplicare</li>
       <li>Gestionarea afacerii și atragerea clienților</li>
     </ul>
   </div>
 </div>
);



export default function OnlineCourseClient({ hasAccess = false }: OnlineCourseClientProps) {
  const { userId } = useAuth();

  const handlePurchase = async () => {
    // Convert undefined to null for the metadata
    const userIdForMetadata: string | null = userId ?? null;

    try {
      const checkoutUrl = await createCheckoutSessionCourse({
        priceId: "price_1QlVh8CV1XqGrlRbwSXDWRRn",
        successUrl: `/cursuri/online`,
        cancelUrl: `/cursuri/online`,
        metadata: { 
          userId: userIdForMetadata,
          isCourse: true
        }
      });
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

 return (
   <div className="flex flex-col items-center min-h-screen bg-gray-50">
     <Hero gradient bgPrimary="primary" bgSecond="white">
       <div className="w-full px-4 lg:w-[700px] lg:-mt-[32px] min-h-[600px] lg:mt-0">
         <h2 className="text-[18px] lg:text-[24px] font-bold text-center leading-5 lg:leading-7">
           Transformă-ți Pasiunea în Carieră cu Academia Noastră
         </h2>
         <p className="text-center text-[13px] lg:text-[16px] text-gray-600 px-4 leading-4 lg:leading-5 mt-[8px]">
           Ești gata să îți duci abilitățile la nivelul următor?
         </p>
       </div>
     </Hero>

     {hasAccess ? (
       <CourseContent />
     ) : (
       <div className="flex flex-col items-center gap-6 mt-8 px-4">
         <div className="max-w-2xl text-center">
           <h3 className="text-2xl font-bold mb-4">
             Curs Profesional de Extensii Gene
           </h3>
           <p className="text-gray-600">
             Investește în viitorul tău și învață de la profesioniști.
             Acest curs complet te va ghida pas cu pas în lumea extensiilor de gene.
           </p>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-[400px]">
           <div className="flex justify-center items-center gap-4 mb-6">
             <span className="text-3xl font-bold">499 RON</span>
             {/* <span className="text-gray-500 line-through">699 RON</span>
             <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
               Reducere 30%
             </span> */}
           </div>
           {
            !userId ?           
            <SignInButton mode="modal">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">
              Autentifică-te pentru Checkout
            </Button>
          </SignInButton>
          :
            (
           <Button 
             onClick={handlePurchase}
             className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
           >
             Înscrie-te Acum
           </Button>
            )
          }
          </div>
         
         <div className="mt-8 grid grid-cols-1 gap-6 max-w-4xl">
           <div className="bg-white p-6 rounded-lg shadow-sm">
             <h4 className="font-semibold mb-2">✨ Acces Permanent</h4>
             <p className="text-sm text-gray-600">
               Revezi materialaul oricând dorești
             </p>
           </div>
           {/* <div className="bg-white p-6 rounded-lg shadow-sm">
             <h4 className="font-semibold mb-2">📱 Suport Online</h4>
             <p className="text-sm text-gray-600">
               Răspundem la toate întrebările tale
             </p>
           </div> */}
           {/* <div className="bg-white p-6 rounded-lg shadow-sm">
             <h4 className="font-semibold mb-2">🎓 Certificare</h4>
             <p className="text-sm text-gray-600">
               Primești certificat la finalizare
             </p>
           </div> */}
         </div>
       </div>
     )}
   </div>
 );
}