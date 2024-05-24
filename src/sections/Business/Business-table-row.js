import PropTypes from "prop-types";
import {
  Box,
  Link,
  Button,
  Avatar,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import { useBoolean } from "src/hooks/use-boolean";
import { useLocales } from "src/locales";
import React, { useState } from "react";
const LazyAvatar = React.lazy(() => import("@mui/material/Avatar"));

export default function BusinessTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onUpdateQty,
}) {
  const {
    name,
    country,
    no_of_orders, 
    mobile_number,
    

    image,
   

    status,

    address,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  // Check if categories is defined before using map
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };
  const {t}=useLocales()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <React.Suspense fallback={<CircularProgress />}>
            <LazyAvatar
              alt={name}
              src={image}
              variant="rounded"
              sx={{ width: 60, height: 64, mr: 2 }}
              onLoad={handleImageLoaded} // Call handleImageLoaded when image is loaded
            />
          </React.Suspense>
          <ListItemText
            disableTypography
            primary={
              <Link
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: "pointer" }}
              >
                {name}
              </Link>
            }
            // secondary={
            //   <Box
            //     component="div"
            //     sx={{ typography: "body2", color: "text.disabled" }}
            //   >
            //     {categoryNames}
            //   </Box>
            // }
          
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(status === "approved" && "info") || "warning"}
          >
            {t(status)}
          </Label>
        </TableCell>

        <TableCell>{address}</TableCell>
        <TableCell>{country}</TableCell>

        <TableCell>{mobile_number}</TableCell>

        <TableCell>{no_of_orders}</TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t("View")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t("Edit")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t("Delete")}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t("Delete")}
        content={t("Are you sure want to delete?")}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow();
            }}
          >
          {t("Delete")}
          </Button>
        }
      />
    </>
  );
}

BusinessTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
