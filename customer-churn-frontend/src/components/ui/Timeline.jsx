// src/components/ui/Timeline.jsx
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import './Timeline.css'; // We will create this CSS file

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]); // Added data dependency

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="timeline-container"
      ref={containerRef}
    >


      <div ref={ref} className="timeline-content-container">
        {data.map((item, index) => (
          <div
            key={index}
            className="timeline-entry"
          >
            <div className="timeline-sticky-header">
              <div className="timeline-dot-container">
                <div className="timeline-dot" />
            </div>
              <h3 className="timeline-entry-title">
                {item.title}
              </h3>
            </div>

            <div className="timeline-entry-content-container">
              <h3 className="timeline-entry-title-mobile">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="timeline-line"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="timeline-line-progress"
          />
        </div>
      </div>
    </div>
  );
};