import Cookie from "js-cookie";
import { atom } from "recoil";
import { CartSchema, UserSchema } from "../_schemas/schemas";

const userState = atom<UserSchema | null>({
  key: "userState",
  default: null,
});

const cartState = atom<CartSchema>({
  key: "cartState",
  default: Cookie.get("cart")
    ? JSON.parse(Cookie.get("cart")!)
    : { items: [], total: 0 },
});

const showCartState = atom<boolean>({
  key: "showCartState",
  default: false,
});

export { userState, cartState, showCartState };
