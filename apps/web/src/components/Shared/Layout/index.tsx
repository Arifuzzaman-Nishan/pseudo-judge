import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Header from "../Header";

const Progress = dynamic(() => import("../Progress"), { ssr: false });

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main id="main__content">
      <Header />
      <div>
        {children}
        <Progress />
      </div>
    </main>
  );
};

export default Layout;
