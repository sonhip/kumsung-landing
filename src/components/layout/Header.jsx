import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { SITE_TEXT } from "../../constants/siteText";

const { company } = SITE_TEXT;

const Header = () => {
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
          <Link to="/" className="brand" aria-label={company.homeAriaLabel}>
            <span className="brand-title">{company.name}</span>
            <span className="brand-tagline">{company.tagline}</span>
          </Link>

          <div
            className="distributor-badge"
            aria-label="Sole distributor information"
          >
            <CheckCircleOutlined />
            <div>
              <strong>{company.distributorLabel}</strong>
              <span>{company.distributorValue}</span>
            </div>
          </div>

          <Button type="primary" className="quote-btn" aria-label="Get a quote">
            {company.quoteButton}
          </Button>
        </div>
      </div>

      <Navbar />
    </motion.header>
  );
};

export default Header;
