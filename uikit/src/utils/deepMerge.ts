export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export default function deepMerge(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// Like spread but undefined source values don't override target values
export function typedMergeProps<T>(target, source: T): T {
  const res = { ...target };
  for (const key in source) {
    const value = source[key];
    if (typeof value !== "undefined") {
      res[key] = value;
    }
  }

  return res;
}

export function mergeProps(target, source) {
  const res = { ...target };
  for (const key in source) {
    const value = source[key];
    if (typeof value !== "undefined") {
      res[key] = value;
    }
  }

  return res;
}
