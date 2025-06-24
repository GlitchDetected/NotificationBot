"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";

export default function ScrollLinked() {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });

  return (
    <div id="example">
      <svg id="progress" width="80" height="80" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
        <motion.circle cx="50" cy="50" r="30" className="indicator" style={{ pathLength: scrollXProgress }} />
      </svg>
      <div className="marquee-container">
        <ul ref={ref}>
          <li style={{ background: "#ff0088" }}></li>
          <li style={{ background: "#dd00ee" }}></li>
          <li style={{ background: "#9911ff" }}></li>
          <li style={{ background: "#0d63f8" }}></li>
          <li style={{ background: "#0cdcf7" }}></li>
          <li style={{ background: "#4ff0b7" }}></li>
        </ul>
      </div>
      <StyleSheet />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */

function StyleSheet() {
  return (
    <style>{`
            #example {
              width: 100vw;
              height: 100vh;
              position: relative;
              overflow: hidden;  /* Hides the overflow */
            }

            #example #progress {
                position: absolute;
                top: -65px;
                left: -15px;
                transform: rotate(-90deg);
            }

            #example .bg {
                stroke: var(--layer);
            }

            #example #progress circle {
                stroke-dashoffset: 0;
                stroke-width: 10%;
                fill: none;
            }

            #progress .indicator {
                stroke: var(--accent);
            }

            /* Marquee container */
            .marquee-container {
                width: 100vw;
                overflow: hidden;
                position: absolute;
                top: 5%;   /* Reduced top margin */
                bottom: 5%; /* Reduced bottom margin */
            }

            #example ul {
                display: flex;
                list-style: none;
                height: 50px;  /* Reduced height */
                padding: 0;
                margin: 0;
                animation: marquee 10s linear infinite;
            }

            /* Marquee effect */
            @keyframes marquee {
                0% {
                    transform: translateX(100%);
                }
                50% {
                    transform: translateX(-50%);
                }
                100% {
                    transform: translateX(-100%);
                }
            }

            #example li {
                flex: 0 0 200px;
                background: var(--accent);
            }

            #example ::-webkit-scrollbar {
                height: 5px;
                width: 5px;
                background: #fff3;
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-thumb {
                background: var(--accent);
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-corner {
                background: #fff3;
            }

    `}</style>
  );
}
