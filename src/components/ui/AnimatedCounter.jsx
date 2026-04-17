import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({ end, suffix = "", label }) => {
  const countRef = useRef(null);

  useEffect(() => {
    const target = countRef.current;
    if (!target) return;

    const data = { value: 0 };

    const tween = gsap.to(data, {
      value: end,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: target,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        target.textContent = `${Math.floor(data.value).toLocaleString()}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, suffix]);

  return (
    <div className="stat-item">
      <div ref={countRef} className="stat-number" aria-live="polite">
        0{suffix}
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default AnimatedCounter;
