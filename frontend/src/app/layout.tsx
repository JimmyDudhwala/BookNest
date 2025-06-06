import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer"
import Header from "./components/Header"
import LayoutWrapper from "./LayoutWrapper";

const Roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display:"swap"
});



export const metadata: Metadata = {
  title: "Book Cart",
  description: "creating book cart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={Roboto_mono.className}
      >
        <LayoutWrapper >

        <Header />
        {children}
        <Footer />
        </LayoutWrapper>
      </body>
    </html>
  );
}
