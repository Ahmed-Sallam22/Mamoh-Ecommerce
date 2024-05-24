import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLocales } from 'src/locales';
import i18n from 'src/locales/i18n';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  orderCode,
  order,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const {t}=useLocales()
  console.log( status?.id === 29 && order.pickup_type===1);
  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> {t("Order")} {orderNumber} </Typography>
              <Label
                variant="soft"
                color={
                  (status?.id === 29 && 'primary') ||
                  (status?.id === 27 && 'info') ||
                  (status?.id === 2 && 'secondary') ||
                  (status?.id === 33 && 'success') ||
                (status?.id === 23 && 'warning') ||
                (status?.id === 35 && 'error') ||
                'default'
                }
              >
                {status?.name}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
            
            { (status?.id === 29 || status?.id === 27) && order.pickup_type===1 ? (
  <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold' }}>
    Order Code : <span>{orderCode}</span>
  </Typography>
) : <>
</>}
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/* <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
           {status?.orders_status?.owner_display_name}
          </Button> */}

          {/* <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button> */}

          {/* <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
            Edit
          </Button> */}
        </Stack>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 180 }}
      >
        {statusOptions?.map((option) => (
          <MenuItem
            key={option.status_id}
            selected={option.status_id === status?.orders_status?.id}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.status_id);
            }}
          >
            {option.translations[1].owner_display_name}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </>
  );
}

OrderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  orderCode: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
