import React from "react";
import { Menu } from "lucide-react";
import "../styles/FloatMenu.css";
import useMediaQuery from "../utils/useMediaQuery";
import { useEffect } from "react";
import AnimatedContent from "./AnimatedContent";

export default function FloatMenu() {
  const isMobile = useMediaQuery(600); // (max-width:600px)

  useEffect(() => {
    if (!isMobile) return;
    console.log("Effect chỉ chạy khi màn hình ≤ 600px");
  }, [isMobile]);

  if (!isMobile) return null; // không render component khi > 600px

  return (
    <AnimatedContent
      distance={300}
      direction="horizontal"
      reverse={true}
      duration={0.6}
      ease="power3.out"
      initialOpacity={0.2}
      animateOpacity
      scale={0.1}
      threshold={0.2}
      delay={0}
    >
      <div className="float-menu">
        <Menu />
      </div>
    </AnimatedContent>
  );
}
