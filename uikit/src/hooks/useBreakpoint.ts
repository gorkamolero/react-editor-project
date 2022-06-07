import { useConfig } from "./configHooks";
import useWindowSize from "./useWindowSize";

interface Options {
  delay: number;
}

const defaultOptions: Options = {
  delay: 150,
};

/**
 * Hook to implement responsiveness.
 *
 * @param breakpoints Single breakpoint or array of breakpoints.
 * @param options Options.
 */
export default function useBreakpoint(breakpoint?: number, options?: Partial<Options>): boolean;
export default function useBreakpoint(breakpoints: number[], options?: Partial<Options>): boolean[];
export default function useBreakpoint(
  breakpoints?: number | number[],
  options?: Partial<Options>
): boolean | boolean[] {
  const theOptions = { ...options, ...defaultOptions };
  const config = useConfig();
  const _breakpoints = breakpoints ?? config.responsive.breakPoint;
  const { width: windowWidth } = useWindowSize({
    debounceDelay: theOptions.delay,
  });

  // special handling of multiple breakpoints
  if (Array.isArray(_breakpoints)) {
    breakpoints = breakpoints as number[];

    const hits = breakpoints.map((breakpoint) => {
      return breakpoint ? windowWidth < breakpoint : false;
    });

    return hits;
  } else {
    return windowWidth < _breakpoints;
  }
}
