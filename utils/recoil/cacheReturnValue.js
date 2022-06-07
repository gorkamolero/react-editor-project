import deepEqual from 'fast-deep-equal'

/**
 * Use this to cache the return value of Recoil's selectors and avoid
 * re-renders of components that use them, even if the underlying value
 * did not change.
 *
 * https://codesandbox.io/s/recoil-tduwc?file=/src/App.js
 *
 */
const cacheReturnValue = (func) => {
  let prevRetVal = null

  return (...args) => {
    const retVal = func(...args)

    if (deepEqual(retVal, prevRetVal)) {
      return prevRetVal
    } else {
      prevRetVal = retVal
      return retVal
    }
  }
}

export default cacheReturnValue
