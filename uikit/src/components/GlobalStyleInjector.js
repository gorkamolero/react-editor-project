/** @jsxImportSource @emotion/react */
import { css, Global, jsx } from "@emotion/core";
import { useConfig } from "../hooks/configHooks";

const GlobalStyleInjector = () => {
  const c = useConfig();

  const { bodyBackground, fontSmoothing, customCss } = c.globals;
  const { breakPoint: headerBreakPoint } = c.Header;
  const { normal } = c.fonts.faces;
  const { breakPoint, fontSize } = c.responsive;
  const { emFontStyle, emColor } = c.fonts.headingsEmphasis;

  const headerCss = css`
    @media (min-width: ${headerBreakPoint + 1}) {
      #hamburger-menu-icon {
        display: none;
      }
    }
    @media (max-width: ${headerBreakPoint + 1}) {
      #inline-links {
        display: none;
      }
    }
  `;

  const globalCss = css`
    body {
      ${bodyBackground ? `background: ${bodyBackground};` : ""}
      font-family: ${normal};
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: ${fontSmoothing};
      @media only screen and (max-width: ${breakPoint}) {
        font-size: ${fontSize};
      }
    }
    a {
      color: inherit;
      font-weight: inherit;
      text-decoration: none;
    }
    h1,
    h2 {
      em {
        color: ${emColor};
        font-style: ${emFontStyle};
      }
    }
    ${headerCss}
    ${customCss}
  `;

  return <Global styles={globalCss} />;
};

export default GlobalStyleInjector;
