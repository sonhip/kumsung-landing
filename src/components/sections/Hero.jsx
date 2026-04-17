"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_TEXT } from "../../constants/siteText";

const { hero } = SITE_TEXT;

const Hero = ({ backgroundImages = hero.backgroundImages }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = backgroundImages.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timerId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => window.clearInterval(timerId);
  }, [totalSlides]);

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="hero-section" aria-label={hero.ariaLabel}>
      <div className="hero-slides" aria-hidden="true">
        {backgroundImages.map((imagePath) => (
          <div
            key={imagePath}
            className={`hero-slide ${
              backgroundImages[currentSlide] === imagePath ? "active" : ""
            }`}
          >
            <img
              className="hero-slide-image"
              src={imagePath}
              alt=""
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hero-nav hero-nav-prev"
        aria-label={hero.prevButtonAriaLabel}
        onClick={goPrev}
      >
        <LeftOutlined />
      </button>
      <button
        type="button"
        className="hero-nav hero-nav-next"
        aria-label={hero.nextButtonAriaLabel}
        onClick={goNext}
      >
        <RightOutlined />
      </button>

      <div className="hero-overlay" />
      <div className="container hero-content">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hero.kicker}
        </motion.p>

        <h1>
          {hero.headlineWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.13, duration: 0.45 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <Link href="/products">
            <Button type="primary" size="large" className="hero-btn-primary">
              {hero.viewProductsButton}
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="large" className="hero-btn-outline">
              {hero.contactButton}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        aria-hidden="true"
      >
        <span />
      </motion.div>
    </section>
  );
};

export default Hero;
