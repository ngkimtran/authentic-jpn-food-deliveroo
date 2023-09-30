import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import Loader from "./Loader";

type RestaurantSchema = {
  id: string;
  attributes: {
    name: string;
    description: string;
    image: {
      data: [
        {
          attributes: {
            url: string;
          };
        }
      ];
    };
  };
};

const GET_RESTAURANTS = gql`
  {
    restaurants {
      data {
        id
        attributes {
          name
          description
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
`;

const RestaurantCard = ({ data }: { data: RestaurantSchema }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 p-4">
    <div className="h-full bg-gray-100 rounded-2xl">
      <Image
        className="w-full h-80 rounded-2xl object-cover"
        height={300}
        width={300}
        src={`${process.env.STRAPI_URL || "http://localhost:1337"}${
          data.attributes.image.data[0].attributes.url
        }`}
        alt=""
      />
      <div className="p-8">
        <div className="mb-3 font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
          {data.attributes.name}
        </div>
        <p className="text-sm text-gray-500 font-bold">
          {data.attributes.description}
        </p>
        <div className="flex flex-wrap md:justify-center -m-2">
          <div className="w-full md:w-auto p-2 my-6">
            <Link
              className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
              href={`/restaurant/${data.id}`}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RestaurantList = ({ searchQuery }: { searchQuery: string }) => {
  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (error) return <div>Error loading restaurants</div>;
  if (loading) return <Loader />;

  if (data.restaurants.data && data.restaurants.data.length) {
    const searchResult = data.restaurants.data.filter(
      (restaurant: RestaurantSchema) =>
        restaurant.attributes.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    return (
      <>
        {searchResult.length > 0 ? (
          <div className="py-16 px-8 bg-white rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap -m-4 mb-6">
                {searchResult.map((res: RestaurantSchema) => {
                  return <RestaurantCard key={res.id} data={res} />;
                })}
              </div>
            </div>
          </div>
        ) : (
          <h1>No Restaurants Found</h1>
        )}
      </>
    );
  }

  return <h5>Add Restaurants</h5>;
};

export default RestaurantList;