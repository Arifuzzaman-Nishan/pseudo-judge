import Register from "@/components/Register";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Register | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default function RegisterPage() {
  return (
    <>
      <Register />
    </>
  );
}
