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
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const {t}=useLocales()

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
                  (status?.orders_status?.id === 5 && 'success') ||
                (status?.orders_status?.id === 4 && 'secondary') ||
                (status?.orders_status?.id === 2 && 'warning') ||
                (status?.orders_status?.id === 3 && 'primary') ||
                (status?.orders_status?.id === 1 && 'info') ||
                (status?.orders_status?.id === 6 && 'error') ||
                'default'
            
                }
              >
                {i18n.language === 'ar' ? status?.orders_status?.translations[0]?.owner_display_name : status?.orders_status?.owner_display_name}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
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
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
