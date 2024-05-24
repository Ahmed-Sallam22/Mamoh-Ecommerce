import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
// routes
import { paths } from "src/routes/paths";
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
//
import OrderDetailsInfo from "../order-details-info";
import OrderDetailsItems from "../order-details-item";
import OrderDetailsToolbar from "../order-details-toolbar";
import OrderDetailsHistory from "../order-details-history";
import { updateOrder, useGetAllFoodOrdersDelivery } from "src/api/delivery";
import { TableSkeleton } from "src/components/table";
import { table } from "src/theme/overrides/components/table";
import { useGetStatics } from "src/api/blog";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { allFoodOrdersDelivery, ordersLoading } = useGetAllFoodOrdersDelivery();
  const {t}=useLocales()

  const currentOrder = allFoodOrdersDelivery.filter((order) => order.id == id)[0];
  const [status, setStatus] = useState(null);
  const [items, setitmes] = useState(null);
  const [data, setdata] = useState(null);
  const { orderStatic } = useGetStatics();console.log(currentOrder);

  useEffect(() => {
    // Set the initial status once data is loaded
    if (!ordersLoading && allFoodOrdersDelivery.length > 0) {
      const initialStatus = allFoodOrdersDelivery.find((item) => item.id == id);
      const nameofstatus = initialStatus?.orders_status?.owner_display_name;
      setStatus(initialStatus || null);
      const product = currentOrder?.details?.map((detail) => setdata(detail));
    }
  }, [ordersLoading, allFoodOrdersDelivery, id]);
  // const handleChangeStatus = useCallback((newValue) => {
  //   try {
  //     const {success ,data}=updateOrder(currentOrder?.id,{ orders_status_id: newValue })    
  //   if (success) {
  //     enqueueSnackbar(" Order Status updated successfully!");
  //     router.push(paths.dashboard.delivery.root);
  //   } else {
  //     console.error("Failed to update business:", data.error);
  //   }
  // } catch (error) {
  //   console.error("An error occurred during business update:", error);
  // }
  
  //   // setStatus(newValue); 
  // }, []);

  return (
    <>
      {ordersLoading ? (
        [...Array(table.rowsPerPage)]?.map((i, index) => (
          <TableSkeleton key={index} />
        ))
      ) : (
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <OrderDetailsToolbar
            backLink={paths.dashboard.orderDelivery.root}
            orderNumber={Number(currentOrder?.order_no)}
            createdAt={currentOrder?.order_date}
            status={status}
            // onChangeStatus={handleChangeStatus}
            statusOptions={orderStatic}
          />
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Stack
                spacing={3}
                direction={{ xs: "column-reverse", md: "column" }}
              >
                <OrderDetailsItems
                  items={currentOrder?.details}
                  taxes={currentOrder?.app_taxes}
                  Visa_taxes={currentOrder?.visa_taxes}
                  shipping={currentOrder?.delivery_price}
                  discount={currentOrder?.total_discont}
                  subTotal={currentOrder?.total_price}
                  totalAmount={currentOrder?.net}
                />

                <OrderDetailsHistory history={currentOrder?.order_date} />
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <OrderDetailsInfo
                customer={currentOrder?.user}
                // address={currentOrder?.user_address}
                // delivery={currentOrder?.delivery}
                payment={currentOrder?.payment_type}
                shippingAddress={currentOrder?.user_address}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
  row: PropTypes.object,
};
