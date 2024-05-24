// @mui
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
// hooks
import PropTypes from "prop-types";

import { useMockedUser } from "src/hooks/use-mocked-user";
// _mock
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
// assets
import { SeoIllustration } from "src/assets/illustrations";
//
import AppWidget from "../app-widget";
import AppWelcome from "../app-welcome";
import AppFeatured from "../app-featured";
import AppNewInvoice from "../app-new-invoice";
import AppTopAuthors from "../app-top-authors";
import AppTopRelated from "../app-top-related";
import AppAreaInstalled from "../app-area-installed";
import AppWidgetSummary from "../app-widget-summary";
import AppCurrentDownload from "../app-current-download";
import AppTopInstalledCountries from "../app-top-installed-countries";
import AnalyticsWidgetSummary from "../../analytics/analytics-widget-summary";
import { useGetALLProducts, useGetMarket_product, useGetProducts } from "src/api/product";
import Iconify from "src/components/iconify";
import { useGetAllBusineses, useGetAllBusinesses } from "src/api/bussiness";
import { useGetAllFoodOrders, useGetAllMarketOrders } from "src/api/delivery";
import { useEffect } from "react";
import { useLocales } from "src/locales";
import i18n from "src/locales/i18n";

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const { t } = useLocales();
  const { Marketproducts, MarketproductsLoading } = useGetMarket_product();
  const { Foodproducts, FoodproductsLoading } = useGetProducts();
  const { businesses, businessesLoading } = useGetAllBusineses();
  const { allMarketOrders, ordersLoading } = useGetAllMarketOrders();
  console.log(allMarketOrders);
  const { allFoodOrders, ordersFoodLoading } = useGetAllFoodOrders();
  const ApprovedProducts = Marketproducts?.filter(
    (product) => product?.status === "approved"
  );
  const PendingProducts = Marketproducts?.filter(
    (product) => product?.status === "pending"
  );
  const rejectedProducts = Marketproducts?.filter(
    (product) => product?.status === "rejected"
  );
  const ApprovedFoodproducts = Foodproducts?.filter(
    (product) => product?.status === "approved"
  );
  const PendingFoodproducts = Foodproducts?.filter(
    (product) => product?.status === "pending"
  );
  const rejectedFoodproducts = Foodproducts?.filter(
    (product) => product?.status === "rejected"
  );

  // const NoStatusProducts = products.filter((product) => product?.status === "");
  const DeliveredDoneOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id === 4
  );
  const OnDemandOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id === 1
  );
  const canceledOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id === 6
  );
  const ReadyOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id ===5
  );
  const RejectedOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id === 3
  );
  const processingOrders = allMarketOrders.filter(
    (order) => order?.orders_status?.id === 2
  );
  const DeliveredDoneFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id === 4
  );
  const OnDemandFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id === 1
  );
  const canceledFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id === 6
  );
  const ReadyFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id ===5
  );
  const RejectedFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id === 3
  );
  const processingFoodOrders = allFoodOrders.filter(
    (order) => order?.orders_status?.id === 2
  );

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "2xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title= {t(`Welcome back \n `)}
            space= {user?.displayName}
            img={<SeoIllustration />}
            
          />
        </Grid>

     
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={t("Market Products")}
            total={
              MarketproductsLoading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" />
              ) : (
                Marketproducts?.length
              )
            }
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={t("Food Products")}
            total={
              FoodproductsLoading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" />
              ) : (
                Foodproducts?.length
              )
            }
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={t("Business")}
            total={
              businessesLoading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" />
              ) : (
                businesses?.length
              )
            }
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title={t("Food Orders")}
            total={
              ordersLoading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" />
              ) : (
                allFoodOrders?.length
              )
            }
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title={t("Market Orders")}
            total={
              ordersLoading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" />
              ) : (
                allMarketOrders?.length
              )
            }
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppCurrentDownload
            title={t("Market Product")}
            chart={{
              series: [
                { label: t("Approved"), value: ApprovedProducts?.length },
                { label: t("Pending"), value: PendingProducts?.length },
                { label: t("Rejected"), value: rejectedProducts?.length },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <AppCurrentDownload
            title={t("Food Product")}
            chart={{
              series: [
                { label: t("Approved"), value: ApprovedFoodproducts?.length },
                { label: t("Pending"), value: PendingFoodproducts?.length },
                { label: t("Rejected"), value: rejectedFoodproducts?.length },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
        <AppCurrentDownload
            title={t("Market Orders")}
            chart={{
              series: [
                { label: t("Delivered to the driver"), value: DeliveredDoneOrders?.length },
                { label: t("Open orders"), value: OnDemandOrders?.length },
                { label: t("Rejected orders"), value: canceledOrders?.length },

                { label: t("Ready orders"), value: RejectedOrders?.length },
                { label: t("Delivered done"), value: ReadyOrders?.length },
                { label: t("processing"), value: processingOrders?.length },
              ],
            }}
          />
          
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <AppCurrentDownload
            title={t("Food Orders")}
            chart={{
              series: [
                { label: t("Delivered to the driver"), value: DeliveredDoneFoodOrders?.length },
                { label: t("Open orders"), value: OnDemandFoodOrders?.length },
                { label: t("Rejected orders"), value: canceledFoodOrders?.length },
                { label: t("processing"), value: processingFoodOrders?.length },
                { label: t("Ready orders"), value: RejectedFoodOrders?.length },
                { label: t("Delivered done"), value: ReadyFoodOrders?.length },
              ],
            }}
          />
          
        </Grid>
      

    
      </Grid>
    </Container>
  );
}
