/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import DropDownMenu from "../forms/DropDownMenu";
import { useConfig, useWindowSize } from "../hooks/configHooks";
import HStack from "../layout/HStack";
import { getFontSize, getFontWeight, getLetterSpacing } from "../utils";
import { mergeProps } from "../utils/deepMerge";
import { Icon } from "./Icon";

const Breadcrumb = (props) => {
  const config = useConfig();

  const {
    crumbs,
    maxCrumbs: providedMaxCrumbs = 99,
    breakPoint,
    onCrumbClick,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.Breadcrumb, props);

  const { width: windowWidth } = useWindowSize();

  const maxCrumbs = breakPoint ? (windowWidth < parseInt(breakPoint) ? 2 : providedMaxCrumbs) : providedMaxCrumbs;

  const { spacing } = config.breadcrumbs;

  const [dropDownShown, setDropDownShown] = useState(false);

  if (!crumbs || crumbs.length === 0) return null;

  const hiddenCrumbs = crumbs.length <= maxCrumbs ? [] : crumbs.slice(1, crumbs.length - maxCrumbs + 1);

  const visibleCrumbs =
    crumbs.length <= maxCrumbs
      ? crumbs.slice(1, crumbs.length)
      : crumbs.slice(crumbs.length - maxCrumbs + 1, crumbs.length);

  const handleCrumbClick = (crumb) => {
    onCrumbClick && onCrumbClick(crumb);
  };

  return (
    <HStack maxWidth="100%" css={externalCSS} noWrap gap={spacing} {...otherProps}>
      <Crumb crumb={crumbs[0]} onClick={() => handleCrumbClick(crumbs[0])} />
      {crumbs.length > 1 && <Separator />}
      {hiddenCrumbs.length > 0 && (
        <Fragment>
          <DropDownMenu
            show={dropDownShown}
            onClickOutside={() => setDropDownShown(false)}
            scrollable={false}
            options={hiddenCrumbs.map((c) => c.title)}
            optionsNames={hiddenCrumbs.map((c) => c.title)}
            selectedOption={null}
            setSelectedOption={(index) => {
              handleCrumbClick(hiddenCrumbs[index]);
              setDropDownShown(false);
            }}
          >
            <Crumb crumb={{ title: "..." }} onClick={() => setDropDownShown(!dropDownShown)} />
          </DropDownMenu>
          <Separator />
        </Fragment>
      )}
      {visibleCrumbs.map((crumb, i) => {
        const separatorPresent = i < visibleCrumbs.length - 1 ? "..." : null;

        return (
          <Fragment key={i}>
            <Crumb crumb={crumb} last={i === visibleCrumbs.length - 1} onClick={() => handleCrumbClick(crumb)} />
            {separatorPresent && <Separator />}
          </Fragment>
        );
      })}
    </HStack>
  );
};

const Crumb = ({ crumb, last, onClick }) => {
  const config = useConfig();
  const { crumbStyle, lastCrumbStyle, emphasizedCrumbStyle } = config.breadcrumbs;

  const style = {
    ...crumbStyle,
    ...(last ? lastCrumbStyle : undefined),
    ...(crumb.emphasized ? emphasizedCrumbStyle : undefined),
    ...crumb.style,
  };

  const crumbCSS = css`
    ${getFontSize("Button", config)}
    ${getFontWeight("Button", config)}
    ${getLetterSpacing("Button", config)}
    :not(.last) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.last {
      flex: 1 0 auto;
    }
  `;

  return (
    <span className={last && "last"} style={style} css={crumbCSS} onClick={() => onClick && onClick(crumb)}>
      {crumb.title}
    </span>
  );
};

const Separator = () => {
  const config = useConfig();
  const { separator } = config.breadcrumbs;

  return (
    <Icon
      style={{ flex: `1 0 ${separator.size}` }}
      name={separator.icon}
      color={separator.color}
      size={separator.size}
      strokeWidth={separator.strokeWidth}
    />
  );
};

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      emphasized: PropTypes.bool,
    })
  ).isRequired,
  maxCrumbs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  breakPoint: PropTypes.string, // Example: 640px
  onCrumbClick: PropTypes.func,
};

export default Breadcrumb;
