import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimateOnScroll = ({
  children,
  delay = 0,
  yOffset = 20,
  className = '',
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false, // This makes the animation trigger every time element comes into view
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
