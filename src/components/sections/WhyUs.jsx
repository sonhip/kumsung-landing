import {
  SafetyCertificateOutlined,
  TrophyOutlined,
  CustomerServiceOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_TEXT } from "../../constants/siteText";

gsap.registerPlugin(ScrollTrigger);

const { whyUs } = SITE_TEXT;

const features = [
  {
    icon: SafetyCertificateOutlined,
    title: whyUs.features[0].title,
    text: whyUs.features[0].text,
  },
  {
    icon: TrophyOutlined,
    title: whyUs.features[1].title,
    text: whyUs.features[1].text,
  },
  {
    icon: CustomerServiceOutlined,
    title: whyUs.features[2].title,
    text: whyUs.features[2].text,
  },
  {
    icon: CheckSquareOutlined,
    title: whyUs.features[3].title,
    text: whyUs.features[3].text,
  },
];

const WhyUs = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;

    if (!leftEl || !rightEl) return;

    const leftTween = gsap.fromTo(
      leftEl,
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: leftEl, start: "top 78%", once: true },
      },
    );

    const rightTween = gsap.fromTo(
      rightEl,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: rightEl, start: "top 78%", once: true },
      },
    );

    return () => {
      leftTween.scrollTrigger?.kill();
      rightTween.scrollTrigger?.kill();
      leftTween.kill();
      rightTween.kill();
    };
  }, []);

  return (
    <section className="why-section" aria-label={whyUs.ariaLabel}>
      <div className="container why-grid">
        <div ref={leftRef} className="why-left">
          <h2>{whyUs.title}</h2>
          <p>{whyUs.description}</p>
        </div>

        <div ref={rightRef} className="why-right">
          {features.map(({ icon: Icon, title, text }) => (
            <motion.article
              key={title}
              className="feature-item"
              whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
            >
              <Icon className="feature-icon" aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
