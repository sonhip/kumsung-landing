"use client";

import { motion } from "framer-motion";

const ScrollReveal = ({
  children,
  delay = 0,
  distance = 30,
  duration = 0.7,
  className,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
