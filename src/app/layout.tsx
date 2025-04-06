import type { Metadata } from "next";
import "./index.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Course Compass",
  description: "TODO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <ReactQueryProvider> */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        {/* </ReactQueryProvider> */}
      </body>
    </html>
  );
}
