"use client";

import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./Navbar";

const Header = ({ brandLogo = null, company, nav }) => {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);
      setVisible(currentY < lastY.current || currentY < 80);
      lastY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      initial={false}
      animate={{ y: visible ? 0 : -140 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="header-main">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={company.homeAriaLabel}>
            {brandLogo ? (
              <img
                src={brandLogo.imageUrl}
                alt={brandLogo.altText || company.shortName}
                className="brand-logo-image"
              />
            ) : (
              <span className="brand-mark" aria-hidden="true">
                <span className="brand-mark-wave" />
                <span className="brand-mark-text">TV</span>
              </span>
            )}
            <span className="brand-copy">
              <span className="brand-title">{company.shortName}</span>
              <span className="brand-tagline">{company.name}</span>
            </span>
          </Link>

          <div
            className="distributor-badge"
            aria-label="Thông tin đối tác phân phối"
          >
            <CheckCircleOutlined />
            <div>
              <strong>{company.distributorLabel}</strong>
              <span>{company.distributorValue}</span>
            </div>
          </div>

          <Link href="/contact" aria-label={company.quoteButton}>
            <Button type="primary" className="quote-btn">
              {company.quoteButton}
            </Button>
          </Link>
        </div>
      </div>

      <Navbar nav={nav} />
    </motion.header>
  );
};

export default Header;
