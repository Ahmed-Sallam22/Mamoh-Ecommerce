import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer,address ,delivery, payment, shippingAddress }) {
  const {t}=useLocales()

  const renderCustomer = (
    <>
      <CardHeader
        title={t("Customer Info")}
        action={
          <IconButton>
            {/* <Iconify icon="solar:pen-bold" /> */}
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.full_name}
          // src={customer.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.full_name}</Typography>

          <Box>
            {t("Email")}: 
          <Box component="span" sx={{ color: 'text.secondary', ml: .5 }}>
              {customer?.email}
              </Box>
              </Box>

          <Box>
            {t("Address")}:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {customer?.country} , {customer?.city}
            </Box>
            </Box>


          <Box>
            {t("Mobile Number")}:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {customer?.country_code}  {customer?.mobile}
            </Box>
           

          </Box>

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
    </>
  );

//   const renderDelivery = (
//     <>
//       <CardHeader
//         title="Delivery"
//         action={
//           <IconButton>
// =          </IconButton>
//         }
//       />
//       <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
//         <Stack direction="row" alignItems="center">
//           <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
//             Ship by
//           </Box>
//           {delivery.shipBy}
//         </Stack>
//         <Stack direction="row" alignItems="center">
//           <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
//             Speedy
//           </Box>
//           {delivery.speedy}
//         </Stack>
//         <Stack direction="row" alignItems="center">
//           <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
//             Tracking No.
//           </Box>
//           <Link underline="always" color="inherit">
//             {delivery.trackingNumber}
//           </Link>
//         </Stack>
//       </Stack>
//     </>
//   );

  const renderShipping = (
    <>
      <CardHeader
        title={t("Shipping")}
        action={
          <IconButton>
            {/* <Iconify icon="solar:pen-bold" /> */}
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t("Address")}
          </Box>
           {shippingAddress?.region_name} , {shippingAddress?.address} , {shippingAddress?.city_name} , {shippingAddress?.country_name}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t("Mobile Number")}
          </Box>
          {shippingAddress?.country_code} {shippingAddress?.mobile}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader
        title={t("Payment")}
        action={
          <IconButton>
          </IconButton>
        }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
        {t("Payment Type")}
        </Box>
        <Typography variant="subtitle2">{payment}</Typography>
        {/* <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} /> */}
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* {renderDelivery} */}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  address: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
