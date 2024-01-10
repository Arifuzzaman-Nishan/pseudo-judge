import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
// import { Toaster } from "@/components/ui/toaster";

import TanstackProvider from "@/lib/tanstackQuery/utils/TanstackProvider";
import Layout from "@/components/Shared/Layout";
import ReduxProvider from "@/lib/redux/provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/Shared/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <TanstackProvider>
              <Layout>
                {children}
                <Toaster
                  richColors
                  closeButton
                  toastOptions={{
                    className: "class",
                  }}
                  duration={3000}
                />
              </Layout>
            </TanstackProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
