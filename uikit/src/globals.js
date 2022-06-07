/**
 * Global variables that we use in utility functions to not pass the config.
 */

export let responsiveBreakpoint = null;

export const globals = {
  notif: null
};

export function updateAfterConfig(config) {
  responsiveBreakpoint = config.responsive.breakPoint;
}
