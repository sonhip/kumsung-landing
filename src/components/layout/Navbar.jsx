"use client";

import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toSlug } from "../../utils/productCatalog";

const defaultNav = {
  home: "Trang chủ",
  products: "Sản phẩm",
  contact: "Liên hệ",
  about: "Giới thiệu",
  toggleMenuAriaLabel: "Mở hoặc đóng menu điều hướng",
  toggleProductsAriaLabel: "Mở menu sản phẩm",
  items: [],
};

const Navbar = ({ nav = defaultNav }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const closeMenus = () => {
    setIsOpen(false);
    setProductsOpen(false);
  };

  const isActive = (href) => pathname === href;
  const isProductsActive = pathname.startsWith("/products");

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar-inner">
        <button
          className="menu-toggle"
          aria-label={nav.toggleMenuAriaLabel}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            href="/"
            onClick={closeMenus}
            className={isActive("/") ? "active" : ""}
          >
            {nav.home}
          </Link>

          <div
            className="nav-products"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className="products-trigger"
              onClick={() => setProductsOpen((value) => !value)}
              aria-expanded={productsOpen}
              aria-label={nav.toggleProductsAriaLabel}
              data-active={isProductsActive}
            >
              {nav.products} <DownOutlined />
            </button>

            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  className="products-dropdown"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {nav.items.map((item) => (
                    <Link
                      key={item}
                      href={`/products/${toSlug(item)}`}
                      onClick={closeMenus}
                    >
                      {item}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact"
            onClick={closeMenus}
            className={isActive("/contact") ? "active" : ""}
          >
            {nav.contact}
          </Link>
          <Link
            href="/about"
            onClick={closeMenus}
            className={isActive("/about") ? "active" : ""}
          >
            {nav.about}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
