import { useRecoilState } from "recoil";
import { CartSchema, DishSchema } from "../_schemas/schemas";
import { cartState } from "../_states/states";

const useRemoveItemFromCart = () => {
  const [cart, setCart] = useRecoilState<CartSchema>(cartState);

  const dispatch = (item: DishSchema) => {
    const newItem = cart.items.find((i) => i.id === item.id);

    if (newItem && newItem.quantity > 1) {
      setCart((prevCart: CartSchema) => ({
        items: prevCart.items.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
        total: prevCart.total - item.attributes.price,
      }));
    } else {
      setCart((prevCart: CartSchema) => ({
        items: prevCart.items.filter((i) => i.id !== item.id),
        total: prevCart.total - item.attributes.price,
      }));
    }
  };

  return { dispatch };
};

export default useRemoveItemFromCart;
