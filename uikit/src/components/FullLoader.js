import { AnimatePresence, motion } from "framer-motion";
import { useConfig } from "../hooks/configHooks";
import { mergeProps } from "../utils/deepMerge";

const FullLoader = (props) => {
  const config = useConfig();

  const { color, alpha, duration, loading, style, radius, ...otherProps } = mergeProps(config.FullLoader, props);

  return (
    <AnimatePresence>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            height: "100%",
            width: "100%",
            opacity: alpha,
            borderRadius: radius,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={loading ? { width: "100%", opacity: 1 } : { width: "0%", opacity: 0 }}
            transition={{ duration: loading ? 2 : 0, ease: [0.1, 0.1, 0, 1] }}
            exit={{ width: "100%", opacity: 0, transition: { duration: 0.3, ease: [0.1, 0.1, 0, 1] } }}
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              height: "100%",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 1,
              background: color,
              ...style,
            }}
            {...otherProps}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default FullLoader;
