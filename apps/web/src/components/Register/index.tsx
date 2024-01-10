"use client";

import React from "react";
import Container from "../Shared/Container";
import Link from "next/link";
import Lottie from "../Shared/Lottie";
import RegisterForm from "./RegisterForm";

const Register = () => {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="max-w-full m-0 sm:m-10 bg-background border shadow sm:rounded-lg flex justify-center  flex-1 ">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className=" flex flex-col items-center">
              <h2 className="text-2xl xl:text-3xl font-extrabold m-0">
                Register
              </h2>
              <div className="w-full flex-1 mt-8">
                <div className="mb-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-muted-foreground tracking-wide font-medium bg-background transform translate-y-1/2">
                    register with email and password
                  </div>
                </div>
                <RegisterForm />
                <div>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold hover:underline  focus:outline-none no-underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-100 text-center hidden h-full lg:flex flex-1 min-h-[80vh]">
            <div className="p-12">
              <Lottie className="" src="/assets/lottiefiles/register.lottie" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Register;
