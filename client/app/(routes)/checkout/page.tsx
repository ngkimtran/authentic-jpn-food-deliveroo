"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useInitialRender from "@/app/_hooks/useInitialRender";
import CheckoutForm from "@/app/_components/CheckoutForm";
import CheckoutCart from "@/app/_components/CheckoutCart";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const Checkout = () => {
  const initialRender = useInitialRender();
  console.log(process.env.NEXT_PUBLIC_STRIPE_PK);
  if (!initialRender) return null;

  return (
    <section className="container mx-auto py-24">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <CheckoutCart />
        </div>
        <div className="col-span-3">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
