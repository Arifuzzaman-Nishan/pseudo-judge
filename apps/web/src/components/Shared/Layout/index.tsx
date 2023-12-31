import React, { ReactNode } from "react";
import Header from "../Header";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main id="main__content">
      <Header />
      <div>{children}</div>
    </main>
  );
};

export default Layout;
