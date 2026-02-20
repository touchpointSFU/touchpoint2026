import { motion, MotionConfig } from "motion/react";
export const NavIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg className="w-6 h-6 relative z-50 fill-theme-pink" viewBox="0 0 24 24">
    <MotionConfig transition={{ duration: 0.3, ease: "circOut" }}>
      <motion.rect
        y="6"
        height="2"
        initial={{ x: 8, width: 7 }}
        animate={{ x: isOpen ? 3 : 6, width: isOpen ? 0 : 8 }}
      />
      <motion.rect
        y="11"
        height="2"
        initial={{ x: 6, width: 9 }}
        animate={{ x: isOpen ? 3 : 3, width: isOpen ? 0 : 9 }}
      />
      <motion.rect
        y="16"
        width="18"
        height="2"
        initial={{ x: 6, width: 9 }}
        animate={{ x: isOpen ? 3 : 3, width: isOpen ? 0 : 9 }}
      />
      <motion.rect
        y="6"
        height="2"
        initial={{ x: 14, width: 7 }}
        animate={{ x: isOpen ? 21 : 14, width: isOpen ? 0 : 7 }}
      />
      <motion.rect
        y="11"
        height="2"
        initial={{ x: 12, width: 9 }}
        animate={{ x: isOpen ? 21 : 12, width: isOpen ? 0 : 9 }}
      />
      <motion.rect
        y="16"
        width="18"
        height="2"
        initial={{ x: 12, width: 9 }}
        animate={{ x: isOpen ? 21 : 12, width: isOpen ? 0 : 9 }}
      />
    </MotionConfig>

    <MotionConfig transition={{ duration: 0.3, ease: "circOut" }}>
      <motion.rect
        height="2"
        x={12}
        y={11}
        initial={{ width: 9 }}
        animate={{ width: isOpen ? 9 : 0 }}
        transform={"rotate(45, 12,12)"}
      />
      <motion.rect
        height="2"
        x={12}
        y={11}
        initial={{ width: 9 }}
        animate={{ width: isOpen ? 9 : 0 }}
        transform={"rotate(-45, 12,12)"}
      />
      <motion.rect
        height="2"
        x={12}
        y={11}
        initial={{ width: 9 }}
        animate={{ width: isOpen ? 9 : 0 }}
        transform={"rotate(135, 12,12)"}
      />
      <motion.rect
        height="2"
        x={12}
        y={11}
        initial={{ width: 9 }}
        animate={{ width: isOpen ? 9 : 0 }}
        transform={"rotate(-135, 12,12)"}
      />
    </MotionConfig>
    {/* <rect x={12} y={12} width={9} height={9} fill="blue" /> */}
  </svg>
);
