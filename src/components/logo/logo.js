import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
// routes
import { RouterLink } from "src/routes/components";
import logoImage from "../../assets/Mamoh Logo/Mamoh Logo V.svg";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

 

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 55,
        height: 55,
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      <img
        src={logoImage}
        alt="Mamoh Logo"
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
