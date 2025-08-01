import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import Searchbtn from "@/components/website/Searchbtn";
import StoreProvider from "@/components/StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SwiftCart",
  description: "Generated by create next app",
  icons: {
    icon: "/Swiftcart.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <Header />
          <Searchbtn />
          {children}
          <Footer />
          <ToastContainer position="top-center" autoClose={2000} />
        </StoreProvider>
      </body>
    </html>
  );
}
