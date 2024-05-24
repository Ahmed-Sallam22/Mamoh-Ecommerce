import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import i18n from 'src/locales/i18n';

// ----------------------------------------------------------------------

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row?.user?.full_name} sx={{ mr: 2 }}>
            {row?.user?.image}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {row?.user?.full_name}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                 {Number(row?.order_no)}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(row?.order_date), 'dd MMM yyyy')}
            secondary={format(new Date(row?.order_date), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

      

        <TableCell>{row?.total_price} {row?.user?.currencies_symbole}</TableCell>


        <TableCell>
          {row?.orders_status?.owner_display_name==null?
             <>
              <Label variant="soft" color={
                (row?.orders_status?.owner_display_name==null && 'error')
              }
               noWrap>
                No Status
              </Label>
             </>
          :<>
          <Label
             variant="soft"
             color={
              (row?.orders_status?.id === 5 && 'success') ||
              (row?.orders_status?.id === 4 && 'secondary') ||
              (row?.orders_status?.id === 2 && 'warning') ||
              (row?.orders_status?.id === 3 && 'primary') ||
              (row?.orders_status?.id === 1 && 'info') ||
              (row?.orders_status?.id === 6 && 'error') ||
               'default'
             }
           >
{ row?.orders_status?.user_display_name }
           </Label>
          </>}
            

       
        </TableCell>

        <TableCell>
          {row?.orders_status?.delivery_display_name==null?
             <>
              <Label variant="soft" color={
                (row?.orders_status?.delivery_display_name==null && 'error')
              }
               noWrap>
                No Status
              </Label>
             </>
          :<>
          <Label
             variant="soft"
             color={
               (row?.orders_status?.id === 5 && 'success') ||
               (row?.orders_status?.id === 4 && 'secondary') ||
               (row?.orders_status?.id === 2 && 'warning') ||
               (row?.orders_status?.id === 3 && 'primary') ||
               (row?.orders_status?.id === 1 && 'info') ||
               (row?.orders_status?.id === 6 && 'error') ||
               'default'
             }
           >
{row?.orders_status?.delivery_display_name }
           </Label>
          </>}
            

       
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

      


   
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

InvoiceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
