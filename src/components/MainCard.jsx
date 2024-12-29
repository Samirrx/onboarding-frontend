import PropTypes from "prop-types";
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

const MainCard = React.forwardRef(
  (
    {
      border = false,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderColor: "#E0E0E0",
          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 0%)",

          ...sx,
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            style={{ fontSize: "1.125rem !important", padding: "0 16px" }}
            title={title}
            action={secondary}
          />
        )}
        {darkTitle && title && (
          <CardHeader
            title={
              <Typography
                sx={{ fontSize: "1.125rem", color: "#121926", fontWeight: 500 }}
              >
                {title}
              </Typography>
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && (
          <Divider sx={{ color: "#212121", borderBottomWidth: "thick" }} />
        )}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default MainCard;
