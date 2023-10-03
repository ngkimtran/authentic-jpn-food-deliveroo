import { useRecoilState } from "recoil";
import { CartSchema, DishSchema } from "../_schemas/schemas";
import { cartState } from "../_states/states";

const useAddItemToCart = () => {
  const [cart, setCart] = useRecoilState<CartSchema>(cartState);

  const dispatch = (item: DishSchema) =>
    !cart.items.find((i) => i.id === item.id)
      ? setCart((prevCart: CartSchema) => ({
          items: [...prevCart.items, { ...item, quantity: 1 }],
          total: prevCart.total + item.attributes.price,
        }))
      : setCart((prevCart: CartSchema) => ({
          items: prevCart.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          total: prevCart.total + item.attributes.price,
        }));

  return { dispatch };
};

export default useAddItemToCart;
