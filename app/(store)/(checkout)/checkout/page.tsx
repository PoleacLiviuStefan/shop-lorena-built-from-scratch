import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Page() {

  const { userId } = await auth();

  if (!userId) {
    return redirect("/cos");
  }


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Secțiunea principală */}
          <div className="lg:col-span-8">
            <CheckoutForm />
          </div>

          {/* Sumarul coșului */}
          <aside className="lg:col-span-4 lg:relative">
            <div className="lg:sticky lg:top-24">
              <CheckoutSummary />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
