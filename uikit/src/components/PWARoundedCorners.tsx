/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import { Fragment } from "react";
import ReactDOM from "react-dom";
import { useDetectBrowser } from "../hooks/configHooks";

const PWARoundedCorners = ({
  radius = 16,
  color = "black",
  iPhoneOnly,
}: {
  radius?: number;
  color?: string;
  iPhoneOnly?: boolean;
}) => {
  const { isIos, isIPad, isPwa } = useDetectBrowser();

  const radiusPx = radius + "px";

  const roundedCSS = css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    transform: translateZ(100px);
    :before {
      content: "";
      display: block;
      width: ${radiusPx};
      height: ${radiusPx};
      background: radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0) ${radiusPx}, ${color} ${radiusPx});
      position: fixed;
      left: 0;
      top: 0px;
    }
  `;

  const rightCSS = css`
    left: unset;
    right: 0;
    :before {
      background: radial-gradient(circle at 0 100%, rgba(0, 0, 0, 0) ${radiusPx}, ${color} ${radiusPx});
      left: unset;
      right: 0;
    }
  `;

  if (isPwa && isIos) {
    if (iPhoneOnly && isIPad) {
      return null;
    }
    return ReactDOM.createPortal(
      <Fragment>
        <div css={[roundedCSS]} />
        <div css={[roundedCSS, rightCSS]} />
      </Fragment>,
      document.querySelector("body")!
    );
  } else {
    return null;
  }
};

export default PWARoundedCorners;
