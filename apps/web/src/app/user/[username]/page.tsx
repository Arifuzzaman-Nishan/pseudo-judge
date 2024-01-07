import Container from "@/components/Shared/Container";
import User from "@/components/User";
import React from "react";

function Userpage({ params }: { params: { username: string } }) {
  return (
    <>
      <User username={params.username} />
    </>
  );
}

export default Userpage;
