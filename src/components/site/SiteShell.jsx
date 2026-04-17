"use client";

import Footer from "../layout/Footer";
import Header from "../layout/Header";
import TopBar from "../layout/TopBar";

export default function SiteShell({ children }) {
  return (
    <div className="page-shell">
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
