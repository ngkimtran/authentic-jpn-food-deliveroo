"use client";

import React, { useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useInitialRender from "@/app/_hooks/useInitialRender";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartState, showCartState, userState } from "../_states/states";
import { CartSchema, UserSchema } from "../_schemas/schemas";
import useResetCart from "../_hooks/useResetCart";

const options = {
  style: {
    base: {
      fontSize: "32px",
      color: "#52a635",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2521",
    },
  },
};

type INITIAL_STATE_TYPE = {
  address: string;
  postalCode: string;
  city: string;
  error: {
    message: string | undefined;
  } | null;
};

const INITIAL_STATE = {
  address: "",
  city: "",
  postalCode: "",
  error: null,
};

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $amount: Int!
    $dishes: JSON!
    $address: String!
    $city: String!
    $postalCode: String!
    $token: String!
  ) {
    createOrder(
      data: {
        amount: $amount
        dishes: $dishes
        address: $address
        city: $city
        postalCode: $postalCode
        token: $token
      }
    ) {
      data {
        id
        attributes {
          token
        }
      }
    }
  }
`;

const CheckoutForm = () => {
  const [data, setData] = useState<INITIAL_STATE_TYPE>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useRecoilValue<UserSchema | null>(userState);
  const cart = useRecoilValue<CartSchema>(cartState);
  const setShowCart = useSetRecoilState<boolean>(showCartState);

  const { dispatch: resetCart } = useResetCart();
  const [createOrder] = useMutation(CREATE_ORDER);

  const initialRender = useInitialRender();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  if (!initialRender) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitOrder = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const cardElement = elements?.getElement(CardElement);
    const token = cardElement ? await stripe?.createToken(cardElement) : null;

    if (token === null) {
      setData({ ...data, error: { message: "Invalid token" } });
      return;
    }

    if (data.address === "") {
      setData({ ...data, error: { message: "Address is required" } });
      return;
    }

    if (data.city === "") {
      setData({ ...data, error: { message: "City is required" } });
      return;
    }

    if (data.postalCode === "") {
      setData({ ...data, error: { message: "Postal code is required" } });
      return;
    }

    if (token?.error) {
      setData({ ...data, error: { message: token.error.message } });
      return;
    }

    const jwt = Cookie.get("token");

    try {
      setLoading(true);

      const { data: response } = await createOrder({
        variables: {
          amount: cart.total,
          dishes: cart.items,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          token: token?.token.id,
        },
        context: {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      });

      if (response.createOrder.data) {
        alert("Transaction Successful, continue your shopping");
        setData(INITIAL_STATE);
        resetCart();
        setShowCart(true);
        router.push("/");
      }
    } catch (error: any) {
      setData({ ...data, error: { message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <div className="bg-white shadow-md rounded-lg p-8">
        <h5 className="text-lg font-semibold">Your information:</h5>
        <hr className="my-4" />
        <div className="flex mb-6">
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block mb-2 test-gray-800 font-medium"
            >
              Address
            </label>
            <input
              id="address"
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="text"
              name="address"
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
        </div>
        <div className="flex mb-6">
          <div className="flex-1 mr-6">
            <label
              htmlFor="city"
              className="block mb-2 test-gray-800 font-medium"
            >
              City
            </label>
            <input
              id="city"
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="text"
              name="city"
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>
          <div className="w-2/4">
            <label
              htmlFor="postalCode"
              className="block mb-2 test-gray-800 font-medium"
            >
              Postal code
            </label>
            <input
              id="postalCode"
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="text"
              name="postalCode"
              onChange={handleChange}
              placeholder="Enter your postal code"
            />
          </div>
        </div>
      </div>
      {cart.items.length > 0 ? (
        <div className="p-6">
          <div>Credit or debit card</div>
          <div className="my-4">
            <CardElement options={options} />
          </div>
          <button
            className="inline-block w-full px-6 py-3 text-center font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 rounded-full"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              user ? submitOrder(e) : router.push("/login")
            }
            disabled={loading}
          >
            {loading ? "Submitting" : "Submit Order"}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-gray-500">
            Add some items to your cart to continue
          </p>
        </div>
      )}
      <div>
        {data.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>{" "}
            <span className="block sm:inline">{data.error.message}</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
