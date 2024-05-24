import PropTypes from "prop-types";
// import { format } from 'date-fns';
// @mui
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from "src/utils/format-number";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onUpdateQty,
  onUpdateQty2
}) {
  const {
    name,
    to_price,
    from_price,
    // publish,
    image,
    categories,
    // quantity,
    // createdAt,
    // available,
    // inventoryType,
    currencies_symbole,
    status,
    no_of_orders,
    qty,
  } = row;
  const confirm = useBoolean();
  const {t}=useLocales()

  const popover = usePopover();

  const categoryNames = categories?.map((cat) => cat.name).join(", ");
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={name}
            src={image}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

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
            secondary={
              <Box
                component="div"
                sx={{ typography: "body2", color: "text.disabled" }}
              >
                {categoryNames}
              </Box>
            }
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

        {/* <TableCell style={{ fontSize: "14px", fontWeight: "bold"}}>
      {qty}
  <button   style={{
    marginRight: '5px',
    marginLeft: '15px',
    backgroundColor: '#203F77',
    color: 'white',
    border: 'none',
    outline: 'none',
    borderRadius:'5px',
    fontSize:'18px',
    cursor:"pointer"

  }}
   onClick={onUpdateQty}>+</button>
  <button 
  style={{
    cursor:"pointer",
    marginRight: '5px',
    marginLeft: '5px',
    backgroundColor: '#203F77',
    paddingLeft:"8px",
    paddingRight:"8px",
    color: 'white',
    border: 'none',
    outline: 'none',
    borderRadius:'5px',
    fontSize:'18px'
  }}  onClick={onUpdateQty2}>-</button>
    </TableCell> */}
   <TableCell>{fCurrency(from_price, currencies_symbole)}</TableCell>
        {to_price === 0 ? (
  <TableCell color="inherit"
  variant="subtitle2"> 
_
</TableCell>
) : (
  <TableCell>{fCurrency(to_price, currencies_symbole)}</TableCell>
)}
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
        {/* <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t("View")}
        </MenuItem> */}

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

ProductTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
