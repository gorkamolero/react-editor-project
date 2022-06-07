import { useEffect, useState } from "react";

export default function useIsClient() {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  return render;
}
