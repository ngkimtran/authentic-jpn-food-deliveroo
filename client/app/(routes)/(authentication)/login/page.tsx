"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { gql, useMutation } from "@apollo/client";
import Cookie from "js-cookie";
import { userState } from "@/app/_states/states";
import Form from "@/app/_components/Form";
import Loader from "@/app/_components/Loader";

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
  const [, setUser] = useRecoilState(userState);
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
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
