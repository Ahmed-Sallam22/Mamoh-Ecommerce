// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessNewEditForm from '../Business-new-edit-form';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function BusinessCreateView() {
  const settings = useSettingsContext();
  const {t}=useLocales()


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("Create a new Store")}
        links={[
          {
            name: t('Dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('Store'),
            // href: paths.dashboard.Stores.root,
          },
          { name: t('New Store') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BusinessNewEditForm />
    </Container>
  );
}
