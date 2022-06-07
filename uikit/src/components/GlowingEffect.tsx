import { motion } from "framer-motion";
import React from "react";

export default function GlowingEffect({
  color,
  radius,
  size = 8,
  duration = 1.5,
}: {
  color: string;
  radius?: number;
  size?: number;
  duration?: number;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxShadow: "0px 0px 0px 0px " + color,
        borderRadius: radius,
        opacity: 0.2,
      }}
      // Loop border animation
      animate={{
        boxShadow: [`0px 0px 0px 0px ${color}`, `0px 0px 0px ${size}px ${color}`, `0px 0px 0px 0px ${color}`],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        loop: Infinity,
      }}
    />
  );
}
