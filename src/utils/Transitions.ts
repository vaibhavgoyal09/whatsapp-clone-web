const componentLeftToRight = {
  initial: { x: "-40%" },
  animate: { x: "0%" },
  exit: {
    x: "-40%",
    transition: { x: { duration: 0.3 }, ease: "linear" },
  },
  transition: { x: { duration: 0.3 }, ease: "linear" },
};

const componentRightToLeft = {
  initial: { x: "40%" },
  animate: { x: "0%" },
  exit: {
    x: "40%",
    transition: { x: { duration: 0.3 }, ease: "linear" },
  },
  transition: { x: { duration: 0.3 }, ease: "linear" },
};

export { componentLeftToRight, componentRightToLeft };
