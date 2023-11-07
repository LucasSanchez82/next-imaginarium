import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header.component";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
