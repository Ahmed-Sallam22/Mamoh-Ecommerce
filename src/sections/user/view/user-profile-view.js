import { useState, useCallback } from "react";
// @mui
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// _mock
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from "src/_mock";
// components
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ProfileHome from "../profile-home";
import ProfileCover from "../profile-cover";
import ProfileFriends from "../profile-friends";
import ProfileGallery from "../profile-gallery";
import ProfileFollowers from "../profile-followers";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------

const TABS = [
  {
    value: "profile",
    label: "Profile",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useMockedUser();

  const [searchFriends, setSearchFriends] = useState("");

  const [currentTab, setCurrentTab] = useState("profile");

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);
  const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading={t('Profile')}
        links={[
          { name:t("Dashboard") , href: paths.dashboard.root },
          { name:t("User"), href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          // role={_userAbout.role}
          name={user?.displayName}
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: "absolute",
            bgcolor: "background.paper",
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: "center",
                md: "flex-end",
              },
            },
          }}
        >
          {/* <Tab key="profile" value="profilessss" icon={<Iconify icon="solar:user-id-bold" width={24} />} label="Profile" /> */}
        </Tabs>
      </Card>

      {currentTab === "profile" && (
        <ProfileHome info={user} posts={_userFeeds} />
      )}
      {/* 
      {currentTab === "followers" && (
        <ProfileFollowers followers={_userFollowers} />
      )} */}
      {/* 
      {currentTab === "friends" && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )} */}

      {/* {currentTab === "gallery" && <ProfileGallery gallery={_userGallery} />} */}
    </Container>
  );
}
