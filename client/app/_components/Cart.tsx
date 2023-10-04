"use client";

import { useRecoilValue, useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { CartItemSchema, CartSchema, UserSchema } from "../_schemas/schemas";
import { cartState, userState, showCartState } from "../_states/states";
import useAddItemToCart from "../_hooks/useAddItemToCart";
import useRemoveItemFromCart from "../_hooks/useRemoveItemFromCart";

export const CartItem = ({ data }: { data: CartItemSchema }) => {
  const { dispatch: addItem } = useAddItemToCart();
  const { dispatch: removeItem } = useRemoveItemFromCart();

  return (
    <div className="px-2 py-6 flex flex-col flex-wrap justify-between border-b border-blueGray-800">
      <div className="w-full">
        <div className="flex flex-row gap-5 justify-between h-full">
          <h6 className="text-left font-bold text-white mb-1">
            {data.attributes.name}
          </h6>
          <span className="pb-4 mb-auto font-medium text-gray-400">
            {data.attributes.price}€
          </span>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex py-4 justify-between">
            <button
              className="inline-block mb-auto font-medium text-sm text-gray-400 hover:text-gray-200"
              onClick={() => removeItem(data)}
            >
              -
            </button>
            <span className="inline-block mx-2 mb-auto font-medium text-gray-400">
              {data.quantity}
            </span>
            <button
              className="inline-block mb-auto font-medium text-sm text-gray-400 hover:text-gray-200"
              onClick={() => addItem(data)}
            >
              +
            </button>
          </div>
          <span className="block mt-2 text-sm font-bold text-white">
            Total: {data.attributes.price * data.quantity} €
          </span>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const user = useRecoilValue<UserSchema | null>(userState);
  const cart = useRecoilValue<CartSchema>(cartState);
  const [showCart, setShowCart] = useRecoilState<boolean>(showCartState);

  const router = useRouter();

  const loginRedirect = () => router.push("/login");

  const cartRedirect = () => {
    setShowCart(false);
    router.push("/checkout");
  };

  return (
    <section className="fixed right-20 top-[162px]">
      <div className="relative max-h-28	">
        <div
          role="button"
          onClick={() => setShowCart((prevState) => !prevState)}
          className="absolute right-0 z-10 bg-green-500 text-white p-3 rounded-full hover:bg-yellow-500 items-center"
        >
          <div className={`${showCart ? "hidden" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3334 8.16667V4.83333C11.3334 2.99238 9.84099 1.5 8.00004 1.5C6.15909 1.5 4.66671 2.99238 4.66671 4.83333V8.16667M2.16671 6.5H13.8334L14.6667 16.5H1.33337L2.16671 6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          {showCart && (
            <div className="rounded-3xl co bg-gray-800">
              <div className="max-w-lg pt-6 pb-8 px-8 mx-auto">
                <div className="flex mb-10 items-center justify-between">
                  <h6 className="font-bold text-2xl text-white mb-0">
                    Your Cart
                  </h6>
                </div>

                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    e.stopPropagation()
                  }
                >
                  {cart.items
                    ? cart.items.map(
                        (item) =>
                          item.quantity > 0 && (
                            <CartItem key={item.id} data={item} />
                          )
                      )
                    : null}
                </div>
                <div
                  className="p-6"
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    e.stopPropagation()
                  }
                >
                  <div className="flex mb-6 content-center justify-between w-full">
                    <span className="text-sm font-bold text-white">
                      Order total:
                    </span>
                    <span className="text-sm font-bold text-white">
                      {Math.abs(cart.total)} €
                    </span>
                  </div>
                  <button
                    onClick={() => (user ? cartRedirect() : loginRedirect())}
                    className="inline-block w-full px-6 py-3 text-center font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 rounded-full"
                  >
                    {user ? "Continue To Pay" : "Login to Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
