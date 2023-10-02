"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { gql, useMutation } from "@apollo/client";
import Cookie from "js-cookie";
import { userState } from "@/app/_states/states";
import Form from "@/app/_components/Form";
import Loader from "@/app/_components/Loader";

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
      user {
        username
        email
      }
    }
  }
`;

const Register = () => {
  const setUser = useSetRecoilState(userState);
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [register, { loading, error }] = useMutation(REGISTER);

  const handleRegister = async () => {
    const { email, password } = formData;
    const { data } = await register({
      variables: { username: email, email, password },
    });

    if (data?.register.user) {
      setUser(data.register.user);
      router.push("/");
      Cookie.set("token", data.register.jwt);
    }
  };

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loader />;

  return (
    <Form
      title="Sign Up"
      buttonText="Sign Up"
      formData={formData}
      setFormData={setFormData}
      callback={handleRegister}
      error={error}
    />
  );
};

export default Register;
