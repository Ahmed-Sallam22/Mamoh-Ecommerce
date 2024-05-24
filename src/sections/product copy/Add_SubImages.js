

import * as Yup from 'yup';
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import { fData } from 'src/utils/format-number';
// assets
import CardHeader from "@mui/material/CardHeader";

import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
    RHFUpload,
    RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { updateuserData } from 'src/api/user';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { endpoints } from 'src/utils/axios';
import axios from 'axios';
import { useLocales } from "src/locales";
import { useResponsive } from "src/hooks/use-responsive";




export default function AddSubImages({handleChangeTab,handelimages,currentProduct,oldData}) {
    const { enqueueSnackbar } = useSnackbar();
    const {t}=useLocales()
    const mdUp = useResponsive("up", "md");
    const { user } = useMockedUser();
    const UpdateUserSchema = Yup.object().shape({
        images: Yup.array()
    });
  
    const defaultValues = useMemo(
        () => ({
     
          images:oldData?.images|| (currentProduct?.images || []).map(image => ( image.image )) || [],
        }),
        [currentProduct,oldData]
      );
  
    const methods = useForm({
      resolver: yupResolver(UpdateUserSchema),
      defaultValues,
    });
  
    const {
      setValue,
      handleSubmit,
      reset,
      trigger,
      watch,
      formState: { isSubmitting },
    } = methods;
    const router = useRouter();
    const auth = useAuthContext();
 
    const handleClickAddImages = async () => {
        // Trigger form validation
        const isValid = await trigger();
        if (isValid) {
          // Proceed to the next step if form is valid
          const formData = methods.getValues(); // Get form values
          handelimages(formData)
          handleChangeTab('Properties');
        }
      };
      const values = watch();

    const handleClick = () => {
          router.push(paths.dashboard.Market_product.root);
      };
    
      const handleDrop = useCallback(
        (acceptedFiles) => {
          const files = values.images || [];
    
          const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
    
          setValue('images', [...files, ...newFiles], { shouldValidate: true });
        },
        [setValue, values.images]
      );
    
      const handleRemoveFile = useCallback(
        (inputFile) => {
          const filtered = values.images && values.images?.filter((file) => file !== inputFile);
          setValue('images', filtered);
        },
        [setValue, values.images]
      );
    
      const handleRemoveAllFiles = useCallback(() => {
        setValue('images', []);
      }, [setValue]);
    
    
  
      useEffect(() => {
    
        if (currentProduct ||oldData) {
          // setValue('nameAr',currentProduct?.translations[1]?.name)
          // setValue('nameen',currentProduct?.translations[0]?.name)
          // setValue('image',currentProduct?.image)
          // setValue('description',currentProduct?.description)
          reset(defaultValues);
         
        }
     
     
      }, [currentProduct,oldData, defaultValues, reset]);
    
    
    
    return (
      <FormProvider methods={methods} >
         {mdUp && (
        <Grid sx={{ mb: 2.5 }} md={5}>
          <Typography variant="h6" style={{ color: "#203F77" }} sx={{ mb: 0.5 }}>
          {t("Upload Sub_images")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB")}
          </Typography>
        </Grid>
      )}
        <Grid container spacing={2}>
     
        <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Images" />}
     
          <Stack spacing={3} sx={{ p: 3 , py:4}}>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
      
          </Stack>
        </Card>
            <Grid xs={12} md={12} sx={{ pt: 5, display: "flex", alignItems: "self-end", justifyContent: "end" }}>

            <LoadingButton onClick={handleClick} type="submit" variant="contained"   sx={{ backgroundColor: "#FF003D", marginRight: 1,"&:hover": {
      backgroundColor: "#FF053D", // Same color on hover
    }, }}
>
Cancel
  </LoadingButton>
            <LoadingButton  type="button" variant="contained" onClick={handleClickAddImages} loading={isSubmitting}>
              Save and Continue
            </LoadingButton>
            </Grid>

          </Grid>
    
        </Grid>
      </FormProvider>
    );
  }