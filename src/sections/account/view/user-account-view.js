import { useState, useCallback } from "react";
// @mui
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// _mock
import {
  _userAbout,
  _userPlans,
  _userPayment,
  _userInvoices,
  _userAddressBook,
} from "src/_mock";
// components
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import AccountGeneral from "../account-general";
import AccountBilling from "../account-billing";
import AccountSocialLinks from "../account-social-links";
import AccountNotifications from "../account-notifications";
import AccountChangePassword from "../account-change-password";
import { t } from "i18next";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function AccountView() {
  const {t}=useLocales()

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState(t("Security"));

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
 const TABS = [
  // {
  //   value: "general",
  //   label: "General",
  //   icon: <Iconify icon="solar:user-id-bold" width={24} />,
  // },
  // {
  //   value: 'billing',
  //   label: 'Billing',
  //   icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  // },
  // {
  //   value: "notifications",
  //   label: "Notifications",
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  // {
  //   value: "social",
  //   label: "Social links",
  //   icon: <Iconify icon="solar:share-bold" width={24} />,
  // },
  {
    value: t("Security"),
    label: t("Security"),
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];
  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: t("Dashboard"), href: paths.dashboard.root },
          { name: t("User"), href: paths.dashboard.user.root },
          { name: t("Account") },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      {/* {currentTab === "general" && <AccountGeneral />} */}

      {/* {currentTab === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )} */}

      {/* {currentTab === "notifications" && <AccountNotifications />} */}

      {/* {currentTab === "social" && (
        <AccountSocialLinks socialLinks={_userAbout.socialLinks} />
      )} */}

      {currentTab === t("Security") && <AccountChangePassword />}
    </Container>
  );
}
