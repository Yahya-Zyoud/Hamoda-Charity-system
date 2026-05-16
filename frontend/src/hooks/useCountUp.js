import { useEffect, useState } from "react";

/**
 * Animates a number from 0 to `end` over `time` milliseconds.
 * Uses requestAnimationFrame for a smooth, jank-free animation that
 * automatically pauses when the tab is hidden.
 *
 * @param {number} end  - The target value to count up to.
 * @param {number} time - Animation duration in milliseconds (default 2000).
 * @returns {number} The current animated value, updated each frame.
 */
export const useCountUp = (end, time = 2000) => {
  const [num, setNum] = useState(0);

  useEffect(() => {
    let start;
    let frame;

    const run = (current) => {
      if (!start) start = current;
      const elapsed = current - start;
      const percent = Math.min(elapsed / time, 1);

      // Exponential ease-out: fast at the start, decelerates near the target.
      // Formula: 1 - 2^(-10t) approaches 1 asymptotically, giving a natural
      // deceleration without overshooting.
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
