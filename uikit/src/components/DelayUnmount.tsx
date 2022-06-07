import { useCallback, useEffect, useState } from "react";
/**
 * Needed to unmount components after their exit animation is completed to avoid glitches.
 */
const DelayUnmount = ({ children, show }) => {
  const [mount, setMount] = useState(show);

  useEffect(() => {
    if (show) setMount(true);
  }, [show]);

  const performUnmount = useCallback(() => {
    setMount(false);
  }, []);

  if (mount) {
    return children({ performUnmount });
  } else {
    return null;
  }
};

export default DelayUnmount;
