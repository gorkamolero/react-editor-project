/**
 * Wraps the config and resolves functions to values on access.
 *
 * @param {object} config The config
 * @param {object} globalConfig Optional parameter used internally for recursion.
 */
export default function wrapConfig(config, globalConfig) {
  if (!config) {
    return config;
  }

  return new Proxy(config, {
    get(obj, key) {
      // don't interfere with properties in Object.prototype
      // only deal with properties explicitly defined in the config
      if (!obj.hasOwnProperty(key)) {
        return obj[key];
      }

      const value = obj[key];

      if (typeof value === "function") {
        let res = value(globalConfig || config);
        while (typeof res === "function") res = res(globalConfig || config);
        return res;
      } else if (typeof value === "object" && !Array.isArray(value) && !isEmotionCssObject(value)) {
        return wrapConfig(value, globalConfig || config);
      } else {
        return value;
      }
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      return {
        configurable: false,
        ...Object.getOwnPropertyDescriptor(target, prop),
      };
    },
  });
}

function isEmotionCssObject(value) {
  if (!value) return false;
  return "name" in value && "styles" in value && "map" in value && "next" in value;
}
