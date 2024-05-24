import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// _mock
import { INVOICE_STATUS_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
import InvoiceToolbar from './invoice-toolbar';
import { ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { useLocales } from 'src/locales';
import i18n from 'src/locales/i18n';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice }) {
  const {t}=useLocales()

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          {t("Subtotal")}
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {invoice?.total_price}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t("Delivery Price")}</TableCell>
        <TableCell width={120} >
          {invoice?.delivery_price}
        </TableCell>
      </StyledTableRow>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t("Visa Taxes")}</TableCell>
        <TableCell width={120} >
          {invoice?.visa_taxes}
        </TableCell>
      </StyledTableRow>

    

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t("App Taxes")}</TableCell>
        <TableCell width={120}>{invoice?.app_taxes}</TableCell>
      </StyledTableRow>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t("Discount")}</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {invoice?.total_discont}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>{t("Total")}</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
        {invoice?.net  } 
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@minimals.cc</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>{t("Description")}</TableCell>

              <TableCell>{t("Qty")}</TableCell>

              <TableCell align="right">{t("Unit price")}</TableCell>

              <TableCell align="right">{t("Total")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoice?.details?.map((row, id) => (
              <TableRow key={id}>
                <TableCell>{id + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row?.product?.name}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row?.product?.description}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.qty}</TableCell>

                <TableCell align="right">{row?.price} ₪</TableCell>

                <TableCell align="right">{row?.price * row.qty }  ₪</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo_single.svg"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (invoice?.orders_status?.id === 5 && 'success') ||
                (invoice?.orders_status?.id === 4 && 'secondary') ||
                (invoice?.orders_status?.id === 2 && 'warning') ||
                (invoice?.orders_status?.id === 3 && 'primary') ||
                (invoice?.orders_status?.id === 1 && 'info') ||
                (invoice?.orders_status?.id === 6 && 'error') ||
                'default'
              }
            >
              {i18n.language === 'ar' ? invoice?.orders_status?.translations[0]?.owner_display_name : invoice?.orders_status?.owner_display_name}
            </Label>

            <Typography variant="h6">{invoice?.invoiceNumber}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t("Invoice From")}
            </Typography>
            {invoice?.business?.name}
            <br />
            {invoice?.business?.country.name} - 
            {invoice?.business?.city.name}  - {invoice?.business?.address}
            <br />
            {t("Phone")}: {invoice?.business?.mobile_number}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t("Invoice To")}
            </Typography>
            {invoice?.user?.full_name}
            <br />
            {invoice?.user?.country} - 
            {invoice?.user?.city}  - {invoice?.user_address?.address}
            <br />
            {t("Phone")}: {invoice?.user?.mobile}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t("Date Create")}
            </Typography>
            {invoice?.order_date}
          
        
          </Stack>

          
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {/* {renderFooter} */}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
