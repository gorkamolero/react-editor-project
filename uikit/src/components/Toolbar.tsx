import React from "react";
import { SharedBoxProps } from "../base/Box";
import { useConfig } from "../hooks";
import Card from "../layout/Card";
import Grid from "../layout/Grid";
import Stack from "../layout/Stack";
import { CssSize } from "../types";
import { mergeProps } from "../utils/deepMerge";

type ToolbarProps = SharedBoxProps & {
  padding?: "string";
  gap?: CssSize;
  background?: "string";
  children?: React.ReactNode;
};

const Toolbar = (props: ToolbarProps) => {
  const config = useConfig();

  const { padding, gap, background, children, ...otherProps } = mergeProps(config.Toolbar, props);

  const hasMultipleChildren = Array.isArray(children) && typeof children.map !== "undefined";

  return (
    <Stack align="center">
      <Card background={background} padding={padding} mx="auto" inline display="inline-block" {...otherProps}>
        <Grid
          columns={hasMultipleChildren ? children.map(() => "1fr").join(" ") : "1fr"}
          gap={gap}
          align="stretch"
          vAlign="center"
        >
          {children}
        </Grid>
      </Card>
    </Stack>
  );
};

export default Toolbar;
