import { atom } from "recoil";
import { UserSchema } from "../_schemas/schemas";

const userState = atom({
  key: "userState",
  default: null as UserSchema | null,
});

export { userState };
