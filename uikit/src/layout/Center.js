/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/core";
import Box from "../base/Box";
import { useConfig } from "../hooks/configHooks";

const Center = (props) => {
  const config = useConfig();
  const {
    children,
    width = "100%",
    at,
    CSS: externalCSS,
    ...otherProps
  } = {
    ...config.Center,
    ...props,
  };

  const mainCSS = css`
    ${at && `@media (max-width: ${at}) {`}
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: ${width};
    margin: 0 auto;
    ${at && `}`}
  `;

  return (
    <Box css={[mainCSS, externalCSS]} {...otherProps}>
      {children}
    </Box>
  );
};

export default Center;
