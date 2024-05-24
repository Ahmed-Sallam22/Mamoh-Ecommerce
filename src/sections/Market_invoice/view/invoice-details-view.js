import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import InvoiceDetails from '../invoice-details';
import { useGetorder } from 'src/api/blog';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView({id}) {
  const { order, orderLoading, orderError } = useGetorder(id);


  const settings = useSettingsContext();

  const {t}=useLocales()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={order?.id}
        links={[
          {
            name: t('Dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('Market Invoice'),
            // href: paths.dashboard.Marketinvoice.root,
          },
          { name: order?.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetails invoice={order} />
    </Container>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
