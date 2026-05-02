import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./home/components/Navbar";
import Footer from "./home/components/Footer";
import SpecialRoutes from "@/SpecialRoutes";
import SessionProvider from "@/components/SessionProvider";

// Local Fonts
const agrandir = localFont({
  src: [
    {
      path: "./../public/fonts/agrandir.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-agrandir",
});

const sotashi = localFont({
  src: [
    {
      path: "./../public/fonts/sotashi-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sotashi",
});

export const metadata = {
  title: "JobPortal — Find Your Dream Job",
  description:
    "Discover thousands of job opportunities, build AI-powered resumes, and prepare for interviews. Your career starts here.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${agrandir.variable} ${sotashi.variable} font-sotashi`}>
        <SessionProvider>
          <SpecialRoutes hideOn={["/login", "/signup", "/dashboard"]}>
            <Navbar />
          </SpecialRoutes>
          {children}
          <SpecialRoutes hideOn={["/login", "/signup", "/dashboard"]}>
            <Footer />
          </SpecialRoutes>
        </SessionProvider>
      </body>
    </html>
  );
}

