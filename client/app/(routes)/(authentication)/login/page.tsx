"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { gql, useMutation } from "@apollo/client";
import Cookie from "js-cookie";
import { userState } from "@/app/_states/states";
import Form, { FormData } from "@/app/_components/Form";
import Loader from "@/app/_components/Loader";
import { UserSchema } from "@/app/_schemas/schemas";

const LOGIN = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        username
        email
      }
    }
  }
`;

const Login = () => {
  const setUser = useSetRecoilState<UserSchema | null>(userState);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    const { email, password } = formData;
    const { data } = await login({
      variables: { identifier: email, password },
    });

    if (data?.login.user) {
      setUser(data.login.user);
      router.push("/");
      Cookie.set("token", data.login.jwt);
    }
  };

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loader />;

  return (
    <Form
      title="Login"
      buttonText="Login"
      formData={formData}
      setFormData={setFormData}
      callback={handleLogin}
      error={error}
    />
  );
};

export default Login;
