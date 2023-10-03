"use client";

import { useSetRecoilState } from "recoil";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/app/_components/Loader";
import { DishSchema } from "../_schemas/schemas";
import { showCartState } from "../_states/states";
import useAddItemToCart from "../_hooks/useAddItemToCart";

const GET_RESTAURANT_DISHES = gql`
  query getRestaurant($id: ID!) {
    restaurant(id: $id) {
      data {
        id
        attributes {
          name
          dishes {
            data {
              id
              attributes {
                name
                description
                price
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const DishCard = ({ data }: { data: DishSchema }) => {
  const setShowCart = useSetRecoilState<boolean>(showCartState);

  const { dispatch: addItem } = useAddItemToCart();

  const handleAddItem = () => {
    addItem(data);
    setShowCart(true);
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="h-full bg-gray-100 rounded-2xl">
        <Image
          className="w-full h-80 rounded-2xl"
          height={300}
          width={300}
          src={`${process.env.STRAPI_URL || "http://localhost:1337"}${
            data.attributes.image.data.attributes.url
          }`}
          alt=""
        />

        <div className="p-8 flex flex-col" style={{ height: "29rem" }}>
          <div className="group inline-block mb-4">
            <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
              {data.attributes.name}
            </h3>
            <h2>{data.attributes.price.toFixed(2)} €</h2>
          </div>
          <p className="text-sm text-gray-500 font-bold h-full">
            {data.attributes.description}
          </p>
          <div className="flex flex-wrap md:justify-center -m-2">
            <div className="w-full md:w-auto p-2 my-6">
              <button
                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                onClick={handleAddItem}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleRestaurant = () => {
  const searchParams = useSearchParams();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: searchParams.get("id") },
  });

  if (error) return <div>Error loading dishes</div>;
  if (loading) return <Loader />;

  if (
    data.restaurant.data &&
    data.restaurant.data.attributes.dishes.data.length > 0
  ) {
    const { restaurant } = data;

    return (
      <div className="py-6">
        <h1 className="text-4xl font-bold text-green-600">
          {restaurant.data.attributes.name}
        </h1>
        <div className="py-16 px-8 bg-white round-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap -m-4 mb-6">
              {restaurant.data.attributes.dishes.data.map(
                (dish: DishSchema) => {
                  return <DishCard key={dish.id} data={dish} />;
                }
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else return <h1>No dishes found</h1>;
};

export default SingleRestaurant;
