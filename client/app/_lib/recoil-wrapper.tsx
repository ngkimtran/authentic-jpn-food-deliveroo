"use client";

import Cookie from "js-cookie";
import { RecoilRoot, useRecoilState } from "recoil";
import { gql, useQuery } from "@apollo/client";
import { userState } from "../_states/states";

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
  const token = Cookie.get("token");
  const [, setUser] = useRecoilState(userState);

  useQuery(CURRENT_USER, {
    skip: !token,
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: (data) => setUser(data?.me),
  });
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
