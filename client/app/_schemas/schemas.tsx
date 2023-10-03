export type RestaurantSchema = {
  id: string;
  attributes: {
    name: string;
    description: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
};

export type DishSchema = {
  id: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
};

export type UserSchema = {
  id: string;
  email: string;
  username: string;
};

export type CartItemSchema = DishSchema & {
  quantity: number;
};

export type CartSchema = {
  items: CartItemSchema[];
  total: number;
};
