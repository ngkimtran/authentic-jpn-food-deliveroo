"use client";

import Cookie from "js-cookie";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { gql, useQuery } from "@apollo/client";
import { cartState, userState } from "../_states/states";
import { CartSchema, UserSchema } from "../_schemas/schemas";
import { useEffect } from "react";

const CURRENT_USER = gql`
  query currentUser {
    me {
      id
      email
      username
    }
  }
`;

const RecoilProvider = ({ children }: React.PropsWithChildren) => {
  const tokenCookie: string | undefined = Cookie.get("token");

  const cart = useRecoilValue<CartSchema>(cartState);
  const setUser = useSetRecoilState<UserSchema | null>(userState);

  useQuery(CURRENT_USER, {
    skip: !tokenCookie,
    context: {
      headers: {
        Authorization: `Bearer ${tokenCookie}`,
      },
    },
    onCompleted: (data) => setUser(data?.me),
  });

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(cart));
  }, [cart]);

  return <>{children}</>;
};

const RecoilWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <RecoilRoot>
      <RecoilProvider>{children}</RecoilProvider>
    </RecoilRoot>
  );
};

export default RecoilWrapper;
