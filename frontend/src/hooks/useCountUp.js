import { useEffect, useState } from "react";

export const useCountUp = (end, time = 2000) => {
  const [num, setNum] = useState(0);

  useEffect(() => {
    let start;
    let frame;

    const run = (current) => {
      if (!start) start = current;
      const elapsed = current - start;
      const percent = Math.min(elapsed / time, 1);

      const easeValue = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);

      setNum(Math.floor(end * easeValue));

      if (percent < 1) {
        frame = requestAnimationFrame(run);
      }
    };

    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [end, time]);

  return num;
};

export default useCountUp;
