import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessNewEditForm from '../Business-new-edit-form';
import { endpoints } from 'src/utils/axios';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------

// ... (other imports)

export default function BusinessEditView(props) {
  const settings = useSettingsContext();
  const { id } = props;
  const {t}=useLocales()
  const [businessEdit, setBusinessEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl =`https://tapis.ma-moh.com${endpoints.Business.details}${id}`;

    axios.get(apiUrl)
      .then((response) => {
        setBusinessEdit(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("Edit")}
        links={[
          { name: t('Dashboard'), href: paths.dashboard.root },
          {
            name: t('Store'),
            // href: paths.dashboard.Stores.root,
          },
          { name: businessEdit?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {loading ? (
        // Render a loading spinner or message
        <p>{t("Loading...")}</p>
      ) : (
        <BusinessNewEditForm currentBusiness={businessEdit} />
      )}
    </Container>
  );
}

BusinessEditView.propTypes = {
  id: PropTypes.string,
};


