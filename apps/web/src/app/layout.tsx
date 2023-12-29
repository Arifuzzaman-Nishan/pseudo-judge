import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
// import { Toaster } from "@/components/ui/toaster";

import Provider from "@/lib/tanstackQuery/utils/TanstackProvider";
import Layout from "@/components/Shared/Layout";
import ReduxProvider from "@/lib/redux/provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className} suppressHydrationWarning={true}>
        <ReduxProvider>
          <Layout>
            <Provider>{children}</Provider>
            <Toaster />
          </Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}
