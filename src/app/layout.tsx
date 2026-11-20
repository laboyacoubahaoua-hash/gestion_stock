import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import GlobalClientEffects from "@/components/GlobalClientEffects";
import Providers from "@/components/AuthProvider";

import "./globals.css";

const geistSans = {
  variable: ""};

const geistMono ={
  variable: ""};

export const metadata: Metadata = {
  title: "Gestion de Stock",
  description: "Systeme de gestion de stock et d'inventaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      {children}
      <GlobalClientEffects />
    </>
  );

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {content}
          </ThemeProvider>
        </Providers>
        
        <Toaster />
      </body>
    </html>
  );
}
