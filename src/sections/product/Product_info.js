

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
  RHFSwitch,
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
import AddSubImages from './Add_SubImages';
import { getValue } from '@mui/system';




export default function ProductInfo({handleChangeTab,handleinfo,currentProduct,oldDate}) {
  console.log(currentProduct);
  console.log(oldDate);
    const { enqueueSnackbar } = useSnackbar();
    const {t}=useLocales()
    const mdUp = useResponsive("up", "md");
    const { user } = useMockedUser();
    const UpdateUserSchema = Yup.object().shape({
      // translations: Yup.array().of(
      //   Yup.object().shape({
      //     name: Yup.string()
      //       .required(t("Product Name is required"))
      //       .max(100, t("Product Name must be at most 100 characters"))
      //       .matches(
      //         /^[\w\s\p{P}]+$/,
      //         t("Please enter at least one character")
      //       ),
      //     locale: Yup.string().required(t("Locale is required")),
      //   })
      // ),
      nameen: Yup.string()
      .required(t("Product Name is required"))
      .max(100, t("Product Name must be at most 100 characters"))
      .matches(
        /^[\w\s\p{P}]+$/,
        t("Please enter at least one character")
      ), 
      nameAr: Yup.string()
      .required(t("Product Name is required"))
      .max(100, t("Product Name must be at most 100 characters"))
      .matches(
        /^([\u0600-\u06FF\s\p{P}]+|[\s\p{P}]*[\u0600-\u06FF]+[\s\p{P}]*|[\s\p{P}]*[\u0600-\u06FF]+)$/,
        t("ensures that the input contains at least one Arabic character.")
      ),
        description: Yup.string()
        .required(t("description is required"))
        .max(500, t("description must be at most 500 characters"))
        .matches(
          /^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/,
          t("Please enter at least one character")
        ), 
        image: Yup.mixed().required('Image is required'),       

    });
  
    const defaultValues = useMemo(
        () => ({
          business_department_id:8,
          translations: [
            {
                name: "",
                locale: "en"
            },
            {
                name: "",
                locale: "ar"
            }
        ],
              description: currentProduct?.description || oldDate?.description|| "",
          image: currentProduct?.image||oldDate?.image || null,
        }),
        [currentProduct,oldDate]
      );
  
    const methods = useForm({
      resolver: yupResolver(UpdateUserSchema),
      defaultValues,
    });
  
    const {
      setValue,
      handleSubmit,
      trigger,
      reset,
      formState: { isSubmitting },
    } = methods;
    const router = useRouter();
    const auth = useAuthContext();
  
    const handleClickAddImages = async () => {
          const arName=methods.getValues('nameAr')
          const enname=methods.getValues('nameen')
        setValue('translations[1].name',arName)
        setValue('translations[0].name',enname)

        const isValid = await trigger();
        if (isValid) {
          const formData = methods.getValues(); // Get form values
          handleinfo(formData)
          console.log(formData);
          handleChangeTab('add_Images');
        }
      };

    async function handleDropMainCover(acceptedFiles) {
        if (currentProduct ) {
          let file = acceptedFiles[0];
    
          const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          const data = {
            image_file_name: newFile,
            imageable_type: "Product",
            imageable_id: currentProduct.id,
          };
    
          setValue(`image`, newFile.preview);
          try {
            const response = await axios.post(
              "https://tapis.ma-moh.com/api/images/create",
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${auth?.user?.accessToken}`,
                },
              }
            );
            enqueueSnackbar("Image uploaded successfully");
            setValue("image", response.data.data.image);
          } catch (error) {
            enqueueSnackbar("Error uploading image", { variant: "error" });
            console.error("Error uploading image:", error);
          }
        } else {
          const file = acceptedFiles[0];
          const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          if (file) {
            setValue(`image`, newFile);
          }
        }
      }

      const handleClick = () => {
       
        router.push(paths.dashboard.product.root);
    };
    useEffect(() => {
    
      if (currentProduct) {
        setValue('nameAr',currentProduct?.translations[1]?.name)
        setValue('nameen',currentProduct?.translations[0]?.name)
        setValue('image',currentProduct?.image)
        setValue('description',currentProduct?.description)
        // reset(defaultValues);
       
      }
   
      if(oldDate){
        setValue('nameAr',oldDate?.nameAr)
        setValue('nameen',oldDate?.nameen)
        setValue('translations[1]?.name',oldDate.nameAr)
        setValue('translations[0]?.name',oldDate.nameen)
      }
    }, [currentProduct,oldDate, defaultValues, reset]);
  
    return (
      <FormProvider methods={methods} >
         {mdUp && (
        <Grid sx={{ mb: 2.5 }} md={5}>
          <Typography variant="h6"style={{ color: "#203F77" }}  sx={{ mb: 0.5 }}>
          {t("Details")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Main image, Title, short description")}
          </Typography>
        </Grid>
      )}
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 3, pb: 4, px: 3}}>
            <Stack>
<Typography variant="subtitle" style={{ color: methods.formState.errors.image  ?"red" : "#203F77" }}>{t("Main Images *")}</Typography>
              <RHFUploadAvatar
              
                name={`image`}
                maxSize={3145728}
                onBlur={() => trigger("image")} 
                onKeyUp={() => trigger("image")}

                onDrop={(acceptedFiles) => handleDropMainCover(acceptedFiles)}
                                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.disabled",
                    }}
                  >
                     {t("Allowed *.jpeg, *.jpg, *.png, *.gif")}
                    <br /> {t("max size of")} {fData(3145728)}
                  </Typography>
                }
              />
             
</Stack>
  
           
           
            </Card>
          </Grid>
  
          <Grid xs={12} md={8}>
          <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 , py:4}}>
            <RHFTextField
              name="nameen"
              label={t("Product Name ( in English ) *")}
              onBlur={() => trigger("nameen")} // Trigger validation on blur
              inputProps={{ maxLength: 100 }} // Limit input length to 100 characters
              onKeyUp={() => trigger("nameen")}
              placeholder={t("Enter Product Name")}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "#203F77",
                },
              }}              />
            <RHFTextField
              name="nameAr"
              label={t("Product Name ( in Arabic ) *")}
              onBlur={() => trigger("nameAr")} // Trigger validation on blur
              inputProps={{ maxLength: 100 }} // Limit input length to 100 characters
              onKeyUp={() => trigger("nameAr")}
              placeholder={t("Enter Product Name")}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "#203F77",
                },
              }}            />

            <RHFTextField
              name="description"
              label={t("Description *")}
              placeholder={t("Please Enter Product Description")}
              InputLabelProps={{ shrink: true,style: { color: methods.formState.errors.description  ?"red": "#203F77" } }}
              multiline
              rows={4}
              onKeyUp={() => trigger("description")}
              onBlur={() => trigger("description")} // Trigger validation on blur
              inputProps={{ maxLength: 500 }} // Limit input length to 100 characters
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