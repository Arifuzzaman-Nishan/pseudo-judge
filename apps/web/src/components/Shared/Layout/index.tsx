import React, { ReactNode } from "react";
import Header from "../Header";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { isLoginQuery } from "@/lib/tanstackQuery/api/authApi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const Layout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["isLogin"],
    queryFn: isLoginQuery,
  });

  return (
    <main id="main__content">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header />
      </HydrationBoundary>
      <div>{children}</div>
    </main>
  );
};

export default Layout;
