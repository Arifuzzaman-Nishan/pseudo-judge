import Image from "next/image";
import React from "react";
import logo from "../../../public/assets/images/logo.png";
import Lottie from "../Shared/Lottie";
import Container from "../Shared/Container";
import LoginForm from "./LoginForm";
import Link from "next/link";

const Login = () => {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="max-w-full m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center  flex-1 ">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className=" flex flex-col items-center">
              <h2 className="text-2xl xl:text-3xl font-extrabold m-0">
                Sign In
              </h2>
              <div className="w-full flex-1 mt-8">
                <div className="mb-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    sign In with email and password
                  </div>
                </div>
                <LoginForm />
                <div>
                  <p className="text-center text-sm text-gray-500 ">
                    Don&#x27;t have an account yet?
                    <Link
                      href="/register"
                      className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none no-underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-100 text-center hidden h-full lg:flex flex-1 min-h-[80vh]">
            <div className="p-12">
              <Lottie className="" src="/assets/lottiefiles/login.lottie" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
