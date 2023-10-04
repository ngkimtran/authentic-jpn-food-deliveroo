"use client";

import React from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "../_states/states";
import { CartItem } from "./Cart";

const CheckoutCart = () => {
  const cart = useRecoilValue(cartState);

  return (
    <div className="rounded-2xl co bg-gray-800">
      <div className="max-w-lg pt-6 pb-8 px-8 mx-auto bg-blueGray-900">
        <div className="flex mb-10 items-center justify-between">
          <h6 className="font-bold text-2xl text-white mb-0">Your Cart</h6>
        </div>

        <div>
          {cart.items
            ? cart.items.map(
                (item) =>
                  item.quantity > 0 && <CartItem key={item.id} data={item} />
              )
            : null}
        </div>
      </div>
      <div className="p-6">
        <div className="flex mb-6 content-center justify-between w-full">
          <span className="text-sm font-bold text-white">Order total:</span>
          <span className="text-sm font-bold text-white">
            {Math.abs(cart.total)} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCart;
