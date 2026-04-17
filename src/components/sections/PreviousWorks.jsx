"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useRef, useState } from "react";
import { SITE_TEXT } from "../../constants/siteText";

const { previousWorks } = SITE_TEXT;

const PreviousWorks = () => {
  const gridRef = useRef(null);
  const [activeWork, setActiveWork] = useState(null);

  const scrollGrid = (direction) => {
    const container = gridRef.current;
    if (!container) return;

    const firstCard = container.querySelector(".work-card");
    const step = firstCard ? firstCard.clientWidth : 320;
    container.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section className="works-section" aria-label={previousWorks.ariaLabel}>
      <div className="works-header-bg">
        <div className="container works-header">
          <h2>{previousWorks.title}</h2>
          <p>{previousWorks.subtitle}</p>
        </div>
      </div>

      <div className="works-gallery-wrap">
        <button
          className="works-nav works-nav-prev"
          aria-label="Previous works"
          type="button"
          onClick={() => scrollGrid(-1)}
        >
          <LeftOutlined />
        </button>
        <button
          className="works-nav works-nav-next"
          aria-label="Next works"
          type="button"
          onClick={() => scrollGrid(1)}
        >
          <RightOutlined />
        </button>

        <div className="works-grid" ref={gridRef}>
          {previousWorks.items.map((item) => (
            <article
              className="work-card"
              key={item.title}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${item.title}`}
              onClick={() => setActiveWork(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveWork(item);
                }
              }}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="work-caption">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(activeWork)}
        onCancel={() => setActiveWork(null)}
        footer={null}
        centered
        width={980}
        className="work-modal"
      >
        {activeWork && (
          <div className="work-modal-content">
            <img src={activeWork.image} alt={activeWork.title} />
            <div className="work-modal-caption">
              <h3>{activeWork.title}</h3>
              <p>{activeWork.subtitle}</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default PreviousWorks;
