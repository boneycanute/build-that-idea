import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import dynamic from "next/dynamic";

const FloatingWidget = dynamic(() => import("@/components/FloatingWidget"), {
  ssr: false,
});

// Font setup
const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/NeueMontreal-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-neue-montreal",
});

export const metadata: Metadata = {
  title: "Build That App",
  description: "Made with 💖 by Metaschool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={neueMontreal.variable}>
      <body className="bg-black text-white font-sans">
        {children}
        <FloatingWidget />
      </body>
    </html>
  );
}
