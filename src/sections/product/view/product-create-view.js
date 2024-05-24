// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductNewEditForm from '../product-new-edit-form';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const settings = useSettingsContext();
  const {t}=useLocales()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("Create a new product")}
        links={[
          {
            name: t('Dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('Product'),
            // href: paths.dashboard.product.root,
          },
          { name: t('New product') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm/>
    </Container>
  );
}
