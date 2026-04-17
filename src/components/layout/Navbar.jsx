import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SITE_TEXT } from "../../constants/siteText";

const { nav } = SITE_TEXT;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const closeMenus = () => {
    setIsOpen(false);
    setProductsOpen(false);
  };

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
          <NavLink to="/" onClick={closeMenus}>
            {nav.home}
          </NavLink>

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
                    <NavLink key={item} to="/products" onClick={closeMenus}>
                      {item}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/contact" onClick={closeMenus}>
            {nav.contact}
          </NavLink>
          <NavLink to="/about" onClick={closeMenus}>
            {nav.about}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
