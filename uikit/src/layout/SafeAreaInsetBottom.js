import React from "react";

const SafeAreaInsetBottom = () => {
  return (
    <div
      style={{
        width: 0,
        height: 0,
        paddingBottom: "constant(safe-area-inset-bottom)",
        paddingBottom: "env(safe-area-inset-bottom)",
        flex: "0 0 0",
      }}
    />
  );
};

export default SafeAreaInsetBottom;
