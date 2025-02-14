'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('https://www.lorenalash.ro/cursuri/curs-online-feline-effect');
    }, 2000);

    // Curățăm timer-ul la demontarea componentei pentru a preveni eventuale scurgeri de memorie
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className='bg-black min-w-screen min-h-screen text-white flex items-center justify-center'>
     
        <h1>Pagina nu a fost găsită</h1>
        <p>Redirecționare în 2 secunde...</p>
     
    </div>
  );
};

export default NotFoundPage;
