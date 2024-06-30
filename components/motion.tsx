"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MotionProps {
  children?: ReactNode;
  isOpen?: boolean;
  className?: string;
}

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-10" },
};

const listVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // stagger the animation by 0.2s for each item
    },
  }),
};

export const AnimatedDiv: React.FC<MotionProps> = ({
  children,
  isOpen = true,
  className = "",
}) => {
  return (
    <motion.div
      initial={"closed"}
      animate={isOpen ? "open" : "closed"}
      transition={{
        duration: 1,
      }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps extends MotionProps {
  items: ReactNode[] | [];
  width?: number;
  height?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  isOpen = true,
  className = "",
}) => {
  return (
    <AnimatePresence>
      <motion.section className={className}>
        {isOpen &&
          items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={listVariants}
            >
              {item}
            </motion.div>
          ))}
      </motion.section>
    </AnimatePresence>
  );
};

export const AnimatedImages: React.FC<AnimatedListProps> = ({
  items,
  isOpen = true,
  className = "",
  width = 300,
  height = 300,
}) => {
  return (
    <AnimatePresence>
      <motion.section className={className}>
        {isOpen &&
          items.map((item, index: number) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={listVariants}
            >
              <Image
                key={index}
                src={item as string}
                width={width}
                height={height}
                className="cursor-pointer rounded-md h-[20vh] hover:scale-110 transition-transform duration-300"
                alt={`image_${index}`}
              ></Image>
            </motion.div>
          ))}
      </motion.section>
    </AnimatePresence>
  );
};
