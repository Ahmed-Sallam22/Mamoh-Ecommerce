import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
// routes
import * as React from 'react';

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
import { updateOrder, useGetAllMarketOrders, useGetOrder, useGetReasones } from "src/api/delivery";
import { TableSkeleton } from "src/components/table";
import { table } from "src/theme/overrides/components/table";
import { useGetStatics } from "src/api/blog";
import { useLocales } from "src/locales";
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import { endpoints, sender } from "src/utils/axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from "src/routes/hooks";
import clsx from 'clsx';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from "src/components/hook-form";
import { TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMemo } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from "axios";


// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
 
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  

  const handleClose = () => {
    setOpen(false);
  };

  const settings = useSettingsContext();
  const {t}=useLocales()
  const { enqueueSnackbar } = useSnackbar();
const router=useRouter()
const { orderbyID, orderLoading, orderError } = useGetOrder(id);
console.log(orderbyID);
const { Reasones} = useGetReasones();
const [order, setorder] = useState();
 const [isLoadingAccept, setIsLoadingAccept] = useState(false);
 const [isLoadingDecline, setIsLoadingDecline] = useState(false);
useEffect(() => {
  setorder(orderbyID)
}, [orderbyID]);

  const handleChangeStatus = async (newValue) => {
    
    const updatedOrder = {
      orders_status_id: newValue
  };
  console.log(updatedOrder);
  // if (newValue === 4) {
  //   updatedOrder.code = order?.owner_code; // Assuming 'order' is available in the scope
  // }
    const URL = [
      endpoints.delivery.update + "/" + order?.id,
      updatedOrder,
    ];
    try {
      const res = await sender(URL);
      if (res.message === "Updated Successfully" || res.message==="تم التحديث بنجاح") {
        // setStatus(res?.data)
        setorder(res?.data)
        enqueueSnackbar(res.message);
        // setRefreshPage(!refreshPage);
        // router.push(paths.dashboard.orderDelivery.root);
      } else {

        enqueueSnackbar("Error", { variant: "error" });
        console.error("Failed to update Order:", res.message);
      }
    } catch (error) {

      enqueueSnackbar("Error", { variant: "error" });
      console.error("An error occurred during Order update:", error);
    }
  };
  const NewProductSchema = Yup.object().shape({
    notes: Yup.string()
    .required(t("Notes is required"))
    .max(500, t("Notes must be at most 500 characters"))  
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, t('Please enter at least one character'))
    ,rejection_reasons_id:Yup.string().required(t("rejection_resones is required"))

  });

  const defaultValues = useMemo(
    () => ({
      rejection_reasons_id: "",
      notes: "",
      orders_status_id:  "",

    }),
    []
  );

  const RejectedFunction = (value) => {
    setValue("orders_status_id",value)
  };
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const URL = [
      endpoints.delivery.update + "/" + order?.id,
      formData,
    ];
    try {
      const res = await sender(URL);
      if (res.message === "Updated Successfully" || res.message==="تم التحديث بنجاح") {
        // setStatus(res?.data)
        setorder(res?.data)
        enqueueSnackbar(res.message);
        setOpen(false);

        // setRefreshPage(!refreshPage);
        // router.push(paths.dashboard.orderDelivery.root);
      } else {

        enqueueSnackbar("Error", { variant: "error" });
        setOpen(false);
        console.error("Failed to update Order:", res.message);
      }
    } catch (error) {

      enqueueSnackbar("Error", { variant: "error" });
      console.error("An error occurred during Order update:", error);
    }
  });

  const handleReassonChange = async (e) => {
    
    const ReassonId = parseInt(e.target.value, 10);
    setValue('rejection_reasons_id',ReassonId)

   
  };
  return (
    <>
      {orderLoading ? (
        [...Array(table.rowsPerPage)]?.map((i, index) => (
          <TableSkeleton key={index} />
        ))
      ) : (
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <OrderDetailsToolbar
            backLink={paths.dashboard.orderDelivery.root}
            orderNumber={Number(order?.order_no)}
            createdAt={order?.order_date}
            status={order?.orders_status}
            orderCode={order?.owner_code}
            order={order}
            // onChangeStatus={handleChangeStatus}
            // statusOptions={orderStatic}
          />
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Stack
                spacing={3}
                direction={{ xs: "column-reverse", md: "column" }}
              >
                <OrderDetailsItems
                  items={order?.details}
                  taxes={order?.app_taxes}
                  Visa_taxes={order?.visa_taxes}
                  shipping={order?.delivery_price}
                  discount={order?.total_discont}
                  subTotal={order?.total_price}
                  totalAmount={order?.net}
                />

                <OrderDetailsHistory history={order?.order_date} />
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <OrderDetailsInfo
                customer={order?.user}
                // address={order?.user_address}
                // delivery={order?.delivery}
                payment={order?.payment_type}
                shippingAddress={order?.user_address}
              />
              {(order?.orders_status.id === 1 && order?.orders_status.id !== 14)&& (
        <>
          <LoadingButton
 onClick={async () => {
  setIsLoadingAccept(true); // Start loading when the button is clicked
  await handleChangeStatus(order?.orders_status.owner_approve_step); // Call your API or function
  setIsLoadingAccept(false); // Stop loading after the action is completed
}}            sx={{ width: '100%', mt: 2 }}
            type="submit"
            variant="contained"
            loading={isLoadingAccept}
            loadingPosition="start" // Optional: Position of the spinner (start, end, bottom, top)
    startIcon={isLoadingAccept && <CircularProgress size={24} color="inherit" />}
          >
            {t('Accept')}
          </LoadingButton>
          <LoadingButton
onClick={() => {
  handleClickOpen();
  RejectedFunction(order?.orders_status.owner_reject_step);
}}// onClick={async () => {
//   setIsLoadingDecline(true); // Start loading when the button is clicked
//   await handleChangeStatus(35); // Call your API or function
//   setIsLoadingDecline(false); // Stop loading after the action is completed
// }}  
sx={{
              backgroundColor: '#FF003D',
              width: '100%',
              mt: 1,
              '&:hover': {
                backgroundColor: '#FF053D',
              },
            }}
            type="submit"
            variant="contained"
           
          >
            {t('Decline')}
          </LoadingButton>
        </>
      )}

      {(order?.orders_status.id === 14 && order?.orders_status.id !== 1) && (
        <LoadingButton
        onClick={async () => {
          setIsLoadingAccept(true); // Start loading when the button is clicked
          await handleChangeStatus(order?.orders_status.owner_approve_step); // Call your API or function
          setIsLoadingAccept(false); // Stop loading after the action is completed
        }}  
          sx={{ width: '100%', mt: 2 }}
          type="submit"
          variant="contained"
          loading={isLoadingAccept}
          loadingPosition="start" // Optional: Position of the spinner (start, end, bottom, top)
  startIcon={isLoadingAccept && <CircularProgress size={24} color="inherit" />}
        >
          {t('Prepared')}
        </LoadingButton>
      )}
    
       {(order?.orders_status.id === 3 && order?.orders_status.id !== 14) && (
        <LoadingButton
        disabled
        sx={{ width: '100%', mt: 2 }}
          type="submit"
          variant="contained"
          
        >
          {t('Waiting deilvery')}
        </LoadingButton>
      )}
      
  
            </Grid>
          </Grid>
        </Container>
      )}
       <div>
       <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"What is the reason For rejected this order?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <FormProvider sx={{ m: 1, mt: 3 }}  methods={methods} onSubmit={onSubmit} >
        <RHFSelect
        native
        name="rejection_reasons_id"
        // onKeyUp={() => trigger("rejection_reasons_id")}
        // onBlur={() => trigger("rejection_reasons_id")} 
        // label={t("Reasson")}
        onChange={handleReassonChange}

      >
          <option value="" disabled selected>{t("Please select rejection resones")}</option> {/* Default option */}

          {Reasones?.map((Reasone) => (
          <option key={Reasone.id} value={Reasone.id}>
            {Reasone.name}
           
          </option>
          
        ))}
      </RHFSelect>
    
    
        <RHFTextField
                  sx={{mt:2}}

          name="notes"
          label={t("Notes *")}
              // InputLabelProps={{ shrink: true }}
              // placeholder={t('Notes')}

              multiline
              rows={4}
              // onKeyUp={() => trigger("notes")}
              // onBlur={() => trigger("notes")} 
              inputProps={{ maxLength: 500 }}
            />
             <Typography sx={{p:2 ,color: 'text.secondary' }}>
             Once you click the confirm button below, you will not be able to accept the order again
          </Typography>
                  <Grid xs={12} md={8} sx={{
          pt: 2,
          display: "flex",
          alignItems: "self-end",
          justifyContent: "end",
        }}>
  <LoadingButton
          
          sx={{
            backgroundColor: '#FF003D',
            mr:2,
            '&:hover': {
              backgroundColor: '#FF053D',
            },
          }}
          variant="contained"
          // size="large"
          onClick={handleClose}
          // loading={isSubmitting}
        >
          {t("Cancel")}
        </LoadingButton>

        <LoadingButton
      
          type="submit"
          variant="contained"
          // size="large" 
          // onClick={onSubmit}
          loading={isSubmitting}
        >
          {t("Submit")}
        </LoadingButton>
       
      </Grid>
      </FormProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
  
        </DialogActions>
      </Dialog>
   
    </div>
    </>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
  row: PropTypes.object,
};
