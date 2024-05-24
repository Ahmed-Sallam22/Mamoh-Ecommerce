

import * as Yup from 'yup';
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
    useGetAllBusineses,
    useGetAllBusinesses,
    useGetAllCurrencies,
    useGetBusinessByCategories,
    useGetBusinessByCategorieschildrensofchild,
    useGetBussiness,
    useGetSubChaincategories,
    useGetSubcategories,
  } from "src/api/bussiness";
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import { useLocales } from "src/locales";
import { useResponsive } from "src/hooks/use-responsive";
import { paths } from 'src/routes/paths';


import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


export default function Properties({handleChangeTab,handelproperties,currentProduct,oldData}) {
    const { enqueueSnackbar } = useSnackbar();
    const {t}=useLocales()
    const mdUp = useResponsive("up", "md");
    const { user } = useMockedUser();
    const { businesses: bussines } = useGetAllBusineses();
    const { currencies } = useGetAllCurrencies();
    const [bussinsselected, setbussinsid] = useState("");

    const { bussiness } = useGetBussiness(bussinsselected);
    console.log(bussines);
    console.log(oldData);
    const defaultValues = useMemo(
      () => ({
        Subcategory:oldData?.Subcategory||null,
        SubChaincategory:oldData?.SubChaincategory||null,
        SubChaincategory2:oldData?.SubChaincategory2||null,
        category:oldData?.category||null,
        business_id: currentProduct?.business_id || oldData?.business_id|| "",
        currencies: currentProduct?.currencies  || oldData?.currencies||"",
        categories: currentProduct?.categories || "",
        country_id: currentProduct?.country_id || oldData?.country_id|| bussiness?.country_id || null,
        city_id: currentProduct?.city_id || oldData?.city_id|| bussiness?.city_id || null,
        mobile_number: currentProduct?.mobile_number  ||oldData?.mobile_number|| bussiness?.mobile_number || null,
        lat: currentProduct?.lat || oldData?.lat|| bussiness?.lat  || null,
        lng: currentProduct?.long || oldData?.long|| bussiness?.long || null,
        email:currentProduct?.email || oldData?.email|| bussiness?.email || null
      }),
      [currentProduct,oldData]
    );
    const [categoryError, setCategoryError] = useState(false);
    const [BussinessError, setBussinessError] = useState(false);
    const [currenciesError, setcurrenciesError] = useState(false);
    const [SubcategoryError, setSubCategoryError] = useState(false);
    const [SubcategoryChainError, setSubCategoryChainError] = useState(false);
    const [SubcategoryChainError2, setSubCategoryChainError2] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoriesidParent, setcategoriesidParent] = useState(null);
    const [categoriesParent, setcategoriesParent] = useState(null);
    const [categoriesParentOfParent, setcategoriesParentOfParent] = useState(null);
    const [categoriesParentOfParent2, setcategoriesParentOfParent2] = useState(null);
    const [currency, setcurrencies] = useState(null);
    // useEffect(() => {
  //  

      // Set the value of business_id to current.bussines if it exists
    //   if (currentProduct?.business_id,oldData?.business_id) {
    //     setValue("business_id", currentProduct?.business_id ||oldData?.business_id );
    //   }
    
    // }, [currentProduct ,oldData, defaultValues, bussiness]);
 

    
      const handleCategories = (newValue) => {
        if( newValue){
          setSelectedCategory(newValue);
          setValue('categories',newValue)
          setValue('category',newValue)
          setValue('Subcategory',null)
          setValue('SubChaincategory',null)
          setValue('SubChaincategory2',null)
          setcategoriesParentOfParent2(null)
          setcategoriesParent(null)
          setcategoriesidParent(null);
          setcategoriesParentOfParent(null)
        }
        else{
          setSelectedCategory(null);
          setValue('categories',null)
          setValue('category',null)
          setValue('SubChaincategory',null)
          setValue('Subcategory',null)
          setcategoriesParentOfParent2(null)
          setcategoriesParent(null)
          setcategoriesidParent(null);
          setcategoriesParentOfParent(null)
        }
      };
      const handleCategoriesChangeParent = (newValue) => {
        if(  newValue){
          setcategoriesParent(newValue)
          setcategoriesidParent(newValue);
          setValue('Subcategory',newValue)
          setValue('SubChaincategory',null)
          setcategoriesParentOfParent2(null)
          setValue('categories',`${selectedCategory},${newValue}`)
          setcategoriesParentOfParent(null)
          setSubCategoryChainError(false);

        }
        else{
          setcategoriesidParent(null);
          setValue('Subcategory',null)
          setcategoriesParentOfParent2(null)
          setValue('categories',`${selectedCategory}`)
          setcategoriesParentOfParent(null)
          setcategoriesParent(null)
          setSubCategoryChainError(false);
    
        }
      };

      const handleCategoriesChangeParentofParent = (newValue) => {
        if(  newValue){
          
          setcategoriesParentOfParent(newValue);
          setcategoriesParentOfParent2(null)
          setValue('categories',`${selectedCategory},${categoriesParent},${newValue}`)
          setValue('SubChaincategory',newValue)

        }
        else{
          setcategoriesParentOfParent(null);
          setcategoriesParentOfParent2(null);
          setValue('categories',`${selectedCategory},${categoriesParent}`)
          // setcategoriesParent(null)
        }
      };
      const handleCategoriesChangeParentofParent2 = (newValue) => {
        if(  newValue){
          setcategoriesParentOfParent2(newValue);
          setValue('SubChaincategory2',newValue)
          setValue('categories',`${selectedCategory},${categoriesParent},${categoriesParentOfParent},${newValue}`)


        }
        else{
          setValue('SubChaincategory2',null)
          setcategoriesParentOfParent2(null);
          setValue('categories',`${selectedCategory},${categoriesParent},${categoriesParentOfParent}`)
          // setcategoriesParent(null)
        }
      };
      const handlebussines = (newValue) => {
        if(newValue){
         setbussinsid(newValue)
         setValue('business_id',newValue)

        }
        else{
          setbussinsid(null)
         setValue('business_id',null)
        }
      };
      const handlecurrencies = (newValue) => {
        if(newValue){
          setcurrencies(newValue)
         setValue('currencies',newValue)

        }
        else{
          setcurrencies(null)
         setValue('currencies',null)
        }
      };
      console.log(currency);

      const { businessesSubcategories, businessesCategoriesParentLoading } =
      useGetSubcategories(selectedCategory,5);
        // categoriesParent
        
      const { businessesSubChaincategories, businessesSubChaincategoriesLoading } =
      useGetSubChaincategories(selectedCategory,categoriesParent,5);

      const { businessesCategoriesParentofpoarent, businessesCategoriesParentofpoarentLoading } =
      useGetBusinessByCategorieschildrensofchild(categoriesParentOfParent,5);
      const { businessesCategories: Categories, businessesCategoriesLoading } =
        useGetBusinessByCategories(5);
    const UpdateUserSchema = Yup.object().shape({
      business_id: Yup.string().required("Business is required"),
      currencies: Yup.string().required("currencies is required"),


    });
  
  
    const methods = useForm({
      resolver: yupResolver(UpdateUserSchema),
      defaultValues,
    });
  
    const {
      setValue,
      control,
      handleSubmit,
      trigger,
      watch,
      reset,
      formState: { isSubmitting },
    } = methods;
    const router = useRouter();

   
    const handleClickAddImages = async () => {
      if (!selectedCategory) {
        setCategoryError(true); // Set error if category is not selected
        setSubCategoryError(false); // Set error if category is not selected
        setSubCategoryChainError(false)
        console.log("2");

        return; // Prevent form submission
      }

      if (selectedCategory &&businessesSubcategories.length>0 &&!categoriesParent) {
        setSubCategoryError(true); // Set error if category is not selected
        setSubCategoryChainError(false)
        console.log("1");

        return; // Prevent form submission
      }
      if (selectedCategory &&categoriesParent &&businessesSubChaincategories.length>0&&!categoriesParentOfParent) {
        setSubCategoryChainError(true); // Set error if category is not selected
        console.log("3");

        return; // Prevent form submission
      }
      if (selectedCategory &&categoriesParent && !categoriesParentOfParent2 &&categoriesParentOfParent &&businessesCategoriesParentofpoarent.length>0) {
        setSubCategoryChainError2(true); // Set error if category is not selected
            console.log("4");
        return; // Prevent form submission
      }
        // Trigger form validation
        const isValid = await trigger();
        if (isValid) {
          // Proceed to the next step if form is valid
          setValue('country_id',bussiness?.country_id)
          setValue('city_id',bussiness?.city_id)
          setValue('lat',bussiness?.lat)
          setValue('lng',bussiness?.long)
          setValue('mobile_number',bussiness?.mobile_number)
          setValue('email',bussiness?.email)
          const formData = methods.getValues(); // Get form values
          handelproperties(formData)
          handleChangeTab('Filters');
        }
      };

      const handleClick = () => {
        router.push(paths.dashboard.Market_product.root);
      };
      // const selectedCategoryId = oldData?.category;
      // const selectedCategoryName = Categories.find((category) => category.id === selectedCategoryId)?.name;
      console.log(currentProduct);
      useEffect(() => {
    
        if (currentProduct ) {
          // reset(defaultValues);
          setValue("business_id",currentProduct?.business_id)
          setbussinsid(currentProduct?.business_id)
          setValue("currencies",currentProduct?.currencies)
          setcurrencies(currentProduct?.currencies)
          if (currentProduct?.categories) {

            
            const level1Categories = currentProduct.categories.filter(
              category => category.level === 1
            );
       
            if(level1Categories){
              setSelectedCategory(level1Categories[0]?.id);
              setValue("category",level1Categories[0]?.id)
              const level2Categories = currentProduct.categories.filter(
                category => category.level === 2
              );
              if(level2Categories){
                setcategoriesParent(level2Categories[0]?.id)
                setValue("Subcategory",level2Categories[0]?.id)
                const level3Categories = currentProduct.categories.filter(
                  category => category.level === 3
                );
                if(level3Categories){
                  setcategoriesParentOfParent(level3Categories[0]?.id)
                  setValue("SubChaincategory",level3Categories[0]?.id)
                  const level4Categories = currentProduct.categories.filter(
                    category => category.level === 4
                  );
                  if(level4Categories){
                    setcategoriesParentOfParent2(level4Categories[0]?.id)
            setValue("SubChaincategory2",level4Categories[0]?.id)
                  }
                }
              }
            }
            
           
          
            
          }

        }
        if(oldData){
          setSelectedCategory(oldData?.category)
          setcategoriesParent(oldData?.Subcategory)
          setcategoriesParentOfParent(oldData?.SubChaincategory)
          setcategoriesParentOfParent2(oldData?.SubChaincategory2)
          setValue('categories',`${oldData?.category},${oldData?.Subcategory},${oldData?.SubChaincategory},${oldData?.SubChaincategory2}`)
          setbussinsid(oldData?.business_id)
          setcurrencies(oldData?.currencies)
          setValue("business_id",oldData?.business_id)
          setValue("currencies",oldData?.currencies)
        }
      }, [currentProduct,oldData, defaultValues, reset ]);
    return (
      <FormProvider methods={methods} >
     {mdUp && (
        <Grid sx={{ mb: 2.5 }}  md={4}>
          <Typography variant="h6" style={{ color: "#203F77" }} sx={{ mb: 0.5 }}>
           {t("Properties")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Additional Categories and Stores...")}
          </Typography>
        </Grid>
      )}
     <Grid container spacing={2}>


       <Grid xs={12} md={12}>
       <Card sx={{ pt: 3, pb: 4, px: 3}}>
            {!mdUp && <CardHeader title="Properties" />}

<Stack spacing={3} sx={{ p: 3 }}>
  <Box
    columnGap={1}
    rowGap={3}
    display="grid"
    gridTemplateColumns={{
      xs: "repeat(1, 1fr)",
      md: "repeat(2, 1fr)",
    }}
  >
       <Autocomplete
    options={bussines || []}
    getOptionLabel={(option) => option.name || ''}
    value={bussines?.find((country) => country.id === bussinsselected) || null}
        onChange={(event, newValue) => {
          if (newValue) {
            handlebussines(newValue.id);
            setbussinsid(newValue.id); // Update bussinsselected state here
          } else {
            setbussinsid(null); // Clear bussinsselected if no value selected
          }
        }}
        onBlur={() => {
          setBussinessError(!bussinsselected); 
        }}
    
        renderInput={(params) => <TextField {...params} label="Choose Bussiness" error={BussinessError&&!bussinsselected} 
        helperText={BussinessError&&!bussinsselected ? "Bussiness is required" : ""} />}
      />
       <Autocomplete
    options={currencies || []}
    getOptionLabel={(option) => option.name || ''}
    value={currencies?.find((country) => country.id === currency) || null}
        onChange={(event, newValue) => {
          if (newValue) {
            handlecurrencies(newValue.id);
            setcurrencies(newValue.id); // Update currency state here
          } else {
            setcurrencies(null); // Clear currency if no value selected
          }
        }}
        onBlur={() => {
          setcurrenciesError(!currency); 
        }}
    
        renderInput={(params) => <TextField {...params} label="Select Currencies" error={currenciesError&&!currency} 
        helperText={currenciesError&&!currency ? "Select Currencies" : ""} />}
      />
   

<Autocomplete
    options={Categories || []}
    getOptionLabel={(option) => option.name || ''}
    value={Categories?.find((country) => country.id === selectedCategory) || null}
        onChange={(event, newValue) => {
          handleCategories(newValue?.id); 
          setSelectedCategory(newValue?.id); // Update selected category when user selects from dropdown
        }}
        onBlur={() => {
          setCategoryError(!selectedCategory); 
        }}
        renderInput={(params) => <TextField {...params} label="Choose Category" error={categoryError && !selectedCategory} 
        helperText={categoryError && !selectedCategory ? "Category is required" : ""} />}
      />

    




    {selectedCategory !==null &&businessesSubcategories.length>0  ? (
   <Autocomplete
   options={businessesSubcategories || []}
   getOptionLabel={(option) => option.name || ''}
   value={businessesSubcategories?.find((country) => country.id === categoriesParent) || null}
       onChange={(event, newValue) => {
         handleCategoriesChangeParent(newValue?.id); 
         setcategoriesParent(newValue?.id); // Update selected category when user selects from dropdown
       }}
       onBlur={() => {
         setSubCategoryError(!categoriesParent); 
       }}
       renderInput={(params) => <TextField {...params} label="Choose Category" 
       error={SubcategoryError && !categoriesidParent &&businessesSubcategories.length>0} // Set error if category is not selected and field is required
       helperText={SubcategoryError && !categoriesidParent &businessesSubcategories.length>0 ? "SubCategory is required" : ""}         />}
     />
 
      

  ) : 
    <></>
  }
   {categoriesParent!==null && selectedCategory !==null && businessesSubChaincategories.length>0 ? (
      <Autocomplete
      options={businessesSubChaincategories || []}
      getOptionLabel={(option) => option.name || ''}
      value={businessesSubChaincategories?.find((country) => country.id === categoriesParentOfParent) || null}
          onChange={(event, newValue) => {
            handleCategoriesChangeParentofParent(newValue?.id); 
            setcategoriesParentOfParent(newValue?.id); // Update selected category when user selects from dropdown
          }}
          onBlur={() => {
            setSubCategoryChainError(!categoriesParentOfParent); 
          }}
          renderInput={(params) => <TextField {...params} label="Choose Category" 
          error={SubcategoryChainError && !categoriesParentOfParent} // Set error if category is not selected and field is required
           helperText={SubcategoryChainError && !categoriesParentOfParent ? "SubChainCategory is required" : ""}         />}
        />
) : <>

</>}
{categoriesParent!==null && categoriesParentOfParent!==null && selectedCategory !==null && businessesCategoriesParentofpoarent.length>0 ? (
    <Autocomplete
    options={businessesCategoriesParentofpoarent || []}
    getOptionLabel={(option) => option.name || ''}
    value={businessesCategoriesParentofpoarent?.find((country) => country.id === categoriesParentOfParent2) || null}
        onChange={(event, newValue) => {
          handleCategoriesChangeParentofParent2(newValue?.id); 
          setcategoriesParentOfParent2(newValue?.id); // Update selected category when user selects from dropdown
        }}
        onBlur={() => {
          setSubCategoryChainError2(!categoriesParentOfParent2); 
        }}
        renderInput={(params) => <TextField {...params} label="Choose Category" 
        error={SubcategoryChainError2 && !categoriesParentOfParent2} // Set error if category is not selected and field is required
         helperText={SubcategoryChainError2 && !categoriesParentOfParent2 ? "SubChainCategory is required" : ""}         />}
      />
    //   <Autocomplete
    //   name="SubChainCategories2"
    //   options={businessesCategoriesParentofpoarent.map((option) => ({
    //     id: option.id,
    //     name: option.name,
    //   }))}
    //   autoHighlight
    //   getOptionLabel={(option) => (categoriesParentOfParent2 !== null ? option.name : '')}
    //   getOptionSelected={(option, value) => option.id === value.id} // Define the equality test based on the "id" property
    //   isOptionEqualToValue={(option, value) => option?.id === value?.id} // Custom equality test
    //   renderOption={(props, option) => (
    //     <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
    //     {option.name} 
    //   </Box>
    //   // categoriesParentOfParent==null?
    //   // :''
    //   )}
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       label="Choose Your SubChainCategories2"
    //       error={SubcategoryChainError2 && !categoriesParentOfParent2} // Set error if category is not selected and field is required
    //       helperText={SubcategoryChainError2 && !categoriesParentOfParent2 ? "SubChainCategory2 is required" : ""}
    //       inputProps={{
    //         ...params.inputProps,
    //         // autoComplete: 'new-password', // disable autocomplete and autofill
    //       }}
    //     />
    //   )}
    //   onChange={(e, newValue) => {
    //     const selectedValue = newValue?.id;
    //     handleCategoriesChangeParentofParent2(selectedValue); // Update state with the selected id
    //     // You can use selectedValue as needed, such as updating state or form data
    //     setSubCategoryChainError2(false);
    //   }}
    //   onBlur={() => {
    //     setSubCategoryChainError2(!categoriesParentOfParent2); // Check if category is selected on blur and set error state
    //   }}
    // />


) : <>

</>}
  </Box>

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