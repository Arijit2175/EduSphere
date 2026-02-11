import { motion } from "framer-motion";

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = ({ color = '#8B5CF6' }) => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
      style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', minHeight: 64 }}
    >
      <motion.div variants={variants} style={{ height: 48, width: 8, background: color, borderRadius: 4 }} />
      <motion.div variants={variants} style={{ height: 48, width: 8, background: color, borderRadius: 4 }} />
      <motion.div variants={variants} style={{ height: 48, width: 8, background: color, borderRadius: 4 }} />
      <motion.div variants={variants} style={{ height: 48, width: 8, background: color, borderRadius: 4 }} />
      <motion.div variants={variants} style={{ height: 48, width: 8, background: color, borderRadius: 4 }} />
    </motion.div>
  );
};

export default BarLoader;
