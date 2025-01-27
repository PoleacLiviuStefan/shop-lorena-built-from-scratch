'use client';

import { useEffect, useState } from 'react';
import Addresses from './Addresses';
import Shipping from './Shipping';
import Payment from './Payment';
import Review from './Review';
import useBasketStore from '@/app/(store)/store';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutFormSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      {/* Addresses Section Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" /> {/* Title */}
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Section Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" /> {/* Shipping option */}
        </div>
      </div>

      {/* Payment Section Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Review Section Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const cart = useBasketStore((state) => state.items);
  const currentStep = useBasketStore((state) => state.currentStep);
  const setCheckoutStep = useBasketStore((state) => state.setCheckoutStep);
  const [isLoading, setIsLoading] = useState(true);

  const steps = ['address', 'shipping', 'payment', 'review'];

  useEffect(() => {
    // Simulăm timpul de încărcare pentru skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isStepCompleted = (stepName: string) => {
    const stepIndex = steps.indexOf(stepName);
    const currentIndex = steps.indexOf(currentStep);
    return stepIndex < currentIndex;
  };

  if (isLoading) {
    return <CheckoutFormSkeleton />;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <div>
        <Addresses 
          isActive={currentStep === 'address'}
          onComplete={() => setCheckoutStep('shipping')}
          showEditButton={isStepCompleted('address')}
          onEdit={() => setCheckoutStep('address')}
        />
      </div>

      <div>
        <Shipping 
          isActive={currentStep === 'shipping'}
          onComplete={() => setCheckoutStep('payment')}
          showEditButton={isStepCompleted('shipping')}
          onEdit={() => setCheckoutStep('shipping')}
        />
      </div>

      <div>
        <Payment 
          isActive={currentStep === 'payment'}
          onComplete={() => setCheckoutStep('review')}
          showEditButton={isStepCompleted('payment')}
          onEdit={() => setCheckoutStep('payment')}
        />
      </div>

      <div>
        <Review 
          isActive={currentStep === 'review'}
          cart={cart}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;