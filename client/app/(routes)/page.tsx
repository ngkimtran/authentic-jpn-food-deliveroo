"use client";

import { useState } from "react";
import RestaurantList from "@/app/_components/RestaurantList";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <main className="mx-auto my-6 container">
      <div className="mb-6">
        <input
          className="appearance-none block w-full p-3 leading-5 text-coolGray-900 border border-coolGray-200 rounded-lg shadow-md placeholder-coolGray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          type="text"
          placeholder="Search restaurants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <RestaurantList searchQuery={searchQuery} />
    </main>
  );
};
export default Home;
