import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Scrollbar from 'src/components/scrollbar';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------
export default function OrderDetailsItems({
  items,
  shipping,
  discount,
  taxes,
  subTotal,
  totalAmount,
  Visa_taxes
})
{
  const {t}=useLocales()

    const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t("Subtotal")}</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{subTotal || '-'}</Box>
      </Stack> 

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t("Delivery Price")}</Box>
        <Box
          sx={{
            width: 160,
            ...(shipping),
            color: 'green'
          }}
        >
          {shipping ? ` ${shipping}` : '-'}
        </Box>
      </Stack>

    

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t("Visa Taxes")}</Box>
        <Box sx={{ width: 160 }}>{Visa_taxes ? Visa_taxes : '-'}</Box>
      </Stack>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t("App Taxes")}</Box>
        <Box sx={{ width: 160 }}>{taxes ? taxes : '-'}</Box>
      </Stack>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t("Discount")}</Box>
        <Box
          sx={{
            width: 160,
            ...(discount && { color: 'error.main' }),
          }}
        >
          {discount ? `- ${discount}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>{t("Total")}</Box>
        <Box sx={{ width: 160 }}>{totalAmount|| '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title={t("Details")} />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar>
          {items?.map((item)=>(
             <Stack
  key={item?.product?.id}
  direction="row"
  alignItems="center"
  sx={{
    py: 3,
    minWidth: 640,
    borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
  }}
>
  <Avatar src={item?.product?.image} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

  <ListItemText
    primary={item?.product?.name}
    // secondary={item?.sku}
    primaryTypographyProps={{
      typography: 'body2',
    }}
    secondaryTypographyProps={{
      component: 'span',
      color: 'text.disabled',
      mt: 0.5,
    }}
  />

  <Box sx={{ typography: 'body2' }}>{t("Quantity")} : {item?.qty}</Box>

  <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
    {item?.price} {item?.currencies_symbole}
  </Box>
</Stack>
          ))}
          
        
        </Scrollbar>

        {renderTotal}
      </Stack>
    </Card>
  );
}

OrderDetailsItems.propTypes = {
  discount: PropTypes.number,
  items: PropTypes.object,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  Visa_taxes: PropTypes.number,
  totalAmount: PropTypes.number,
};
