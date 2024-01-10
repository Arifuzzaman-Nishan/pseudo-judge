import Login from "@/components/Login";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default function LoginPage() {
  return (
    <>
      <Login />
    </>
  );
}
