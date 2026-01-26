import "../../../css/satoshi.css";
import "../../../css/style.css"; // This now includes flatpickr and jsvectormap

import { Sidebar } from "@/components/Layouts/sidebar";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../../providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Kiddies Town Admin Dashboard",
    default: "Kiddies Town",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <SidebarProvider>
            <NextTopLoader color="#5750F1" showSpinner={false} />

            <div className="flex min-h-screen">
              <Sidebar />

              <div className="flex-1 flex flex-col">
                <Header />
                
                <main className="flex-1 bg-gray-2 dark:bg-[#020d1a] overflow-auto">
                  <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}