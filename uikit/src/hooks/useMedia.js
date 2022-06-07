import { useEffect, useState } from "react";

export default function useMedia(queries, values, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const updateValue = () => {
      const matchedIndex = mediaQueryLists.findIndex(mql => mql.matches);
      const matchedValue =
        typeof values[matchedIndex] !== "undefined" ? values[matchedIndex] : defaultValue;
      setValue(matchedValue);
    };
    const mediaQueryLists = queries.map(q => window.matchMedia(q));
    updateValue();

    const handler = () => updateValue();
    mediaQueryLists.forEach(mql => mql.addListener(handler));
    return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
  }, [queries, values, defaultValue]);

  return value;
}
