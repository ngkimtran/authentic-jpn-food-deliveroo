import { useSetRecoilState } from "recoil";
import { CartSchema } from "../_schemas/schemas";
import { cartState } from "../_states/states";

const useResetCart = () => {
  const setCart = useSetRecoilState<CartSchema>(cartState);

  const dispatch = () => setCart({ items: [], total: 0 });

  return { dispatch };
};

export default useResetCart;
