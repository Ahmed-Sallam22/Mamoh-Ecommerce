/* eslint-disable no-use-before-define */

import PropTypes from "prop-types";
import * as Yup from "yup";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// _mock
// import { NumbersID, countriesData } from "src/_mock";
import { createBusiness, updateBusiness } from "src/api/Business";
// components
// import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from "src/components/hook-form";
import axios from "axios";
import { CounteryCitesBusines } from "./Business-Countery-cites";
import BusinessMap from "./Business-Map-Location";
import { useAuthContext } from "src/auth/hooks";
import { fData } from "src/utils/format-number";
import { endpoints } from "src/utils/axios";
import { enqueueSnackbar } from "notistack";
import { useGetBusinessByCategories,   
  useGetBusinessByCategorieschildrensofchild,
  useGetBussiness,
  useGetSubChaincategories,
  useGetSubcategories, } from "src/api/bussiness";
import { useGETFillterColor } from "src/api/product";
import { Autocomplete, Checkbox, Chip, CircularProgress, FormGroup, FormLabel, TextField } from "@mui/material";
import { useLocales } from "src/locales";
import Backdrop from '@mui/material/Backdrop';

// ----------------------------------------------------------------------

export default function BusinessNewEditForm({ currentBusiness }) {
  const router = useRouter();
  const auth = useAuthContext();

  const mdUp = useResponsive("up", "md");
  const {t}=useLocales()

  // const { enqueueSnackbar } = useSnackbar();
  

  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
    .required(t("Name is required"))
    .max(100, t("Name must be at most 100 characters"))  
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, t('Please enter at least one character'))
    ,
    image: Yup.mixed().required('Image is required'),       
    address: Yup.string()
    .required(t('Address is required'))
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, t('Please enter at least one character')),
    description: Yup.string().required(t("description is required"))
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, t('Please enter at least one character'))      .max(500,t("description must be at most 500 characters")),
    mobile_number: Yup.string()
    .required(t("Mobile number is required"))
    .matches(
      /^[0-9]{5,15}$/, // Adjust the regular expression according to your requirements
      t("Invalid phone number")
    )
    ,    
 email: Yup.string().required(t('Email is required'))
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     t('Invalid email format')
    ),
    facebook: Yup.string()
    .matches(
      /^$|(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9.]*/,
      t('Please enter a valid Facebook link')
    ),
    website: Yup.string()
    .matches(
      /^$|(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/,
      t('Please enter a valid website link')
    )
,
snapchat: Yup.string()
    .matches(
      /^$|https?:\/\/(?:www\.)?snapchat\.com\/add\/[a-zA-Z0-9-_]+(?:\?[\w=&-]+)?/,
      t('Please enter a valid snapchat link')
    )
,
instagram: Yup.string()
    .matches(
      /^$|(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_]+\/?(\?[\w=&-]+)?/,
      t('Please enter a valid instagram link')
    )
,
whatsapp:Yup.string()
.matches(
  /^$|^[0-9]{5,15}$/,
  t("Invalid phone number")
),
store_id:Yup.string().required(t("Store code is required")),
country_id:Yup.string().required(t("country is required"))
});

  const defaultValues = useMemo(
      () => ({
        name: currentBusiness?.name || "",
        description: currentBusiness?.description || "",
        // categories: currentBusiness?.categories || "",
        image: currentBusiness?.image || '',
        images: currentBusiness?.images || [],
        mobile_number: currentBusiness?.mobile_number || "",
        facebook: currentBusiness?.facebook || "",
        website: currentBusiness?.website || "",
        instagram: currentBusiness?.instagram || "",
        email: currentBusiness?.email || "",
        whatsapp: currentBusiness?.whatsapp || "",
        snapchat: currentBusiness?.snapchat || "",
        address: currentBusiness?.address || "",
        country_id: currentBusiness?.country_id || "",
        city_id: currentBusiness?.city_id || "",
        lat: currentBusiness?.lat || 4748,
        lng: currentBusiness?.long || 1425,
        store_id:currentBusiness?.store_id||null ,
        is_store_id_visible : 1,
        currencies:currentBusiness?.currencies||2
      }),
    [currentBusiness]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const [counteries, setCounteries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://tapis.ma-moh.com/api/countries?page=1&per_page=200', {
       
        });

        setCounteries(response.data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
    
    if (currentBusiness) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://tapis.ma-moh.com/api/cities?page=1&per_page=200&country_id=${currentBusiness?.country_id}`);
          setCities(response.data.data);
          setSelectedCountry(currentBusiness?.country_id);
          setSelectedCity(currentBusiness?.city_id);
          reset(defaultValues);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
    
      fetchCities();
    }
  }, [currentBusiness, defaultValues, reset]);
  const handleCountryChange = async (e) => {
    
    const countryId = parseInt(e.target.value, 10);
    setValue('country_id',countryId)

    setSelectedCountry(countryId);
    handlereigionChange(countryId)
    // Fetch the list of cities based on the selected country
    try {
      const response = await axios.get(`https://tapis.ma-moh.com/api/cities?page=1&per_page=200&country_id=${countryId}`, {
     
      });

      setCities(response.data.data);

    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const [Rigion, setRigion] = useState();
  const handlereigionChange = async (countryId) => {    
    try {
      const response = await axios.get(`https://tapis.ma-moh.com/api/regions?active=1&page=1&per_page=200&country_id=${countryId}`, {
     
      });
      setRigion(response.data.data);

    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  

  const [displayMap, setdisplayMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    if (selectedLocation) {
      setValue("lat", location.lat);
      setValue("lng", location.lng);
    }
  };

  const butonLocation = () => {
    setdisplayMap(!displayMap);
  };
  const slectLocation = () => {
    setdisplayMap(!displayMap);
  };

  const handleCityChange = (e) => {
    const cityId = parseInt(e.target.value, 10);
    setSelectedCity(cityId);
    setValue('city_id', cityId); 
  };
  const [SelectedRegion, setSelectedRegion] = useState();
  const handleRegionChange = (e) => {
    const RegionId = parseInt(e.target.value, 10);
    setSelectedRegion(RegionId);
    setValue('region_id', RegionId); 
  };
  const [isFoodStaff, setIsFoodStaff] = useState(false); // Initial state is unchecked (false)
  const handleSwitchChange = (event) => {
    
    setIsFoodStaff(event.target.checked); 

setValue('is_food_stuff', event.target.checked ? 1 : 0);
};
const [selectedValues, setSelectedValues] = useState([]);
const [open, setOpen] = React.useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    // formData.categories=combinedValues;
    formData.business_department_id = 1;
    formData.filters=selectedValues.join(',')   
    console.log(formData); 
    if (currentBusiness) {
      setValue('filters',selectedValues.join(','))
      try {
        setOpen(true)

        const {success ,data} = await updateBusiness(
          currentBusiness.id,
          formData
        );
        if (success) {
          setOpen(false)

          enqueueSnackbar(" Business updated successfully!");
          router.push(paths.dashboard.Stores.root);
        } else {
          setOpen(false)

          console.error("Failed to update business:", data.error);
        }
      } catch (error) {
        setOpen(false)

        console.error("An error occurred during business update:", error);
      }
    } else {
      formData.lat = selectedLocation ? selectedLocation.lat : null;
      formData.lng = selectedLocation ? selectedLocation.lng : null;

      try {
        setOpen(true)

        const response = await axios.post(
          `https://tapis.ma-moh.com${endpoints.Business.create}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth?.user?.accessToken}`,
            },
          }
        );
        enqueueSnackbar("Create success!");
        reset();
        setOpen(false)

        router.push(paths.dashboard.Stores.root);
        console.info("DATA", response);
      } catch (error) {
        console.error(error);
        setOpen(false)

        enqueueSnackbar(error?.response?.data?.errors, { variant: "error" });
      }
      
    }
  });

 
  // const [isStoreIdVisible, setIsStoreIdVisible] = useState(false);
  async function handleDropCover(acceptedFiles) {
    if (currentBusiness) {
      let file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      const data = {
        image_file_name: newFile,
        imageable_type: "Business",
        imageable_id: currentBusiness.id,
      };
      setValue("image", newFile.preview);
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

        setValue("image", response?.data?.data?.image);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      const file = acceptedFiles[0]; // Get the first file from acceptedFiles
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("image", newFile);
      }
    }
  }
 
 
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
  const [categoryError, setCategoryError] = useState(false);
  const [SubcategoryError, setSubCategoryError] = useState(false);
  const [SubcategoryChainError, setSubCategoryChainError] = useState(false);
  const [SubcategoryChainError2, setSubCategoryChainError2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesidParent, setcategoriesidParent] = useState(null);
  const [categoriesParent, setcategoriesParent] = useState(null);
  const [categoriesParentOfParent, setcategoriesParentOfParent] = useState(null);
  const [categoriesParentOfParent2, setcategoriesParentOfParent2] = useState(null);


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

  const { businessesSubcategories, businessesCategoriesParentLoading } =
      useGetSubcategories(selectedCategory,1);
        // categoriesParent
        
      const { businessesSubChaincategories, businessesSubChaincategoriesLoading } =
      useGetSubChaincategories(selectedCategory,categoriesParent,1);

      const { businessesCategoriesParentofpoarent, businessesCategoriesParentofpoarentLoading } =
      useGetBusinessByCategorieschildrensofchild(categoriesParentOfParent,1);
      const { businessesCategories: Categories, businessesCategoriesLoading } =
        useGetBusinessByCategories(1);
    const { Colors } = useGETFillterColor(selectedCategory,1);

const handleCheckboxChange = (event, filterId) => {
  const { checked } = event.target;

  if (checked) {
    setSelectedValues((prevValues) => [...prevValues, filterId]); // Add the filterId to the array

  } else {
    setSelectedValues((prevValues) =>
      prevValues.filter((id) => id !== filterId)
    ); // Remove the filterId from the array
  }
};
useEffect(() => {
    
  if (currentBusiness ) {
    const x =currentBusiness.filters.map(filter => filter.id)
    setSelectedValues(x)
    // setValue('filters',selectedValues.join(','))
    setValue("lat", currentBusiness.lat);
    setValue("lng", currentBusiness.lng);    // setSelectedLocation(currentBusiness.lat)
    setValue("business_id",currentBusiness?.business_id)
    setValue("currencies",currentBusiness?.currencies)
    if (currentBusiness?.categories) {
      const level1Categories = currentBusiness.categories.filter(
        category => category.level === 1
      );
      const level2Categories = currentBusiness.categories.filter(
        category => category.level === 2
      );
      const level3Categories = currentBusiness.categories.filter(
        category => category.level === 3
      );
      const level4Categories = currentBusiness.categories.filter(
        category => category.level === 4
      );
      setValue('categories',`${level1Categories[0]?.id},${level2Categories[0]?.id},${level3Categories[0]?.id},${level4Categories[0]?.id}`)

      setSelectedCategory(level1Categories[0]?.id);
      setValue("category",level1Categories[0]?.id)
      setcategoriesParent(level2Categories[0]?.id)
      setValue("Subcategory",level2Categories[0]?.id)
      setcategoriesParentOfParent(level3Categories[0]?.id)
      setValue("SubChaincategory",level3Categories[0]?.id)
      setcategoriesParentOfParent2(level4Categories[0]?.id)
      setValue("SubChaincategory2",level4Categories[0]?.id)
    }

  }

}, [currentBusiness, defaultValues, reset ]);
  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Details")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Title, short description, image...")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name"
            placeholder={t('Name of Store')}
            type="text"
            InputLabelProps={{ shrink: true }}
             label={t("Store Name *")}
             onBlur={() => trigger("name")} // Trigger validation on blur
             inputProps={{ maxLength: 100 }} // Limit input length to 100 characters
             onKeyUp={() => trigger("name")} />

            <RHFTextField
              name="description"
              label={t("Description *")}
              InputLabelProps={{ shrink: true }}
              placeholder={t('Description of Store')}

              multiline
              rows={4}
              onKeyUp={() => trigger("description")}
              onBlur={() => trigger("description")} // Trigger validation on blur
              inputProps={{ maxLength: 500 }}
            />
            <Stack spacing={1.5}>
              <Typography variant="subtitle">{t("Cover Image")}</Typography>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDropCover}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
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
            <Stack spacing={1.5}>
              <Typography variant="subtitle">{t("Images")}</Typography>
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

                <Stack spacing={1.5}>
                  {/* <Typography variant="subtitle2">Sub Images</Typography> */}
                  {/* <RHFUpload
                    multiple
                    thumbnail
                    name="images"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
                    onUpload={() => console.info("ON UPLOAD")}
                  /> */}
                </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Properties")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Additional Categories,Address and country ....")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
                 <RHFTextField name="store_id" label={t("Store Code *")}     placeholder={t("Store Code")}
                onKeyUp={() => trigger("store_id")}
                onBlur={() => trigger("store_id")} 
                type="text"
                InputLabelProps={{ shrink: true }} />

              <RHFTextField
                name="address"
                label={t("Address *")}
                placeholder={t("Address")}
                onKeyUp={() => trigger("address")}
                onBlur={() => trigger("address")} 
                type="text"
                InputLabelProps={{ shrink: true }}
              />

                   <RHFSelect
        native
        name="country_id"
        label={t("Country")}
        value={selectedCountry}
        InputLabelProps={{ shrink: true }}
        onChange={handleCountryChange}
      >
          <option value="" disabled selected>{t("Please select Your Country")}</option> {/* Default option */}

        {counteries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
           
          </option>
          
        ))}
      </RHFSelect>

      <>
  {cities?.length > 0 ? (
    <RHFSelect
      native
      name="city_id" 
      label={t("City")}
      value={selectedCity}
      onChange={handleCityChange}
      InputLabelProps={{ shrink: true }}
    >
      <option value="" disabled>Please select a city</option> 
      {cities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </RHFSelect>
  ) : (
    <RHFSelect
      native
      name="city_id"
      label={t("City")}
      value="" 
      InputLabelProps={{ shrink: true }}
      disabled 
    >
      <option>{t("No cities available")}</option>
    </RHFSelect>
  )}
</>
      <>
  {Rigion?.length > 0 ? (
    <RHFSelect
      native
      name="region_id" 
      label={t("Region")}
      value={SelectedRegion}
      onChange={handleRegionChange}
      InputLabelProps={{ shrink: true }}
    >
      <option value="" disabled>{t("Please select a Region")}</option> 
      {Rigion.map((rigion) => (
        <option key={rigion.id} value={rigion.id}>
          {rigion.name}
        </option>
      ))}
    </RHFSelect>
  ) : (
    <RHFSelect
      native
      name="region_id" 
      label={t("Region")}
      value="" 
      InputLabelProps={{ shrink: true }}
      disabled 
    >
      <option>{t("No Regions available")}</option>
    </RHFSelect>
  )}
</>

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
    
) : <>

</>}



            </Box>
            <Stack>
              
            <Grid>
                {!displayMap === false && (
                  <BusinessMap onLocationChange={handleLocationChange} />
                )}
              </Grid>
              <Grid>
                
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={butonLocation}
                  style={{ display: displayMap ? "none" : "visible" }}
                >
                  {t("Choose Your Location")}
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={slectLocation}
                  style={{ display: selectedLocation ? "block" : "none" }}
                >
                  {!displayMap ? t("Edit Your Location ") : t("Done")}
                </LoadingButton>
              </Grid>
            </Stack>
        

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderlinkes = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t("contact")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("Additional Your social media sites and your numbers...")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
              
              <RHFTextField
                name="email"
                label={t("Email *")}
                placeholder={t("Email")}
                type="email"
                onKeyUp={() => trigger("email")}
                onBlur={() => trigger("email")}
                InputLabelProps={{ shrink: true }}
              />
 <RHFTextField
  name="mobile_number"
  label={t("Mobile Number *")}
  placeholder={t("Mobile Number")}
  type="text"
  onKeyUp={() => trigger("mobile_number")}
  onBlur={() => trigger("mobile_number")}
  InputLabelProps={{ shrink: true }}
/>
              <RHFTextField
                name="website"
                label={t("Website")}
                placeholder={t("Website")}
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="facebook"
                label={t("facebook")}
                placeholder={t("facebook")}
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="instagram"
                label={t("instgram")}
                placeholder={t("instgram")}
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="whatsapp"
                label={t("Whatsapp")}
                placeholder={t("Whatsapp")}
                type="text"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="snapchat"
                label={t("snapchat")}
                placeholder={t("snapchat")}
                type="text"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderFilters = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Filters")} 
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Additional Filters")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >

          
{Colors?.map((col, id) => (
        <FormGroup key={id}>
          <FormLabel component="legend">{col?.filterMaster?.name}</FormLabel>
          {col.filterDetails.map((filter) => (
            <FormControlLabel
              key={filter.id}
              control={
                <Checkbox
                  checked={selectedValues.includes(filter.id)}
                  onChange={(event) => handleCheckboxChange(event, filter.id)}
                />
              }
              label={filter.name}
            />
          ))}
        </FormGroup>
      ))}

      {/* Display the selected values */}
              {/* {Colors?.length>0?<> */}
              
                {/* {Colors?.map((col, id) => {
    if (Colors) {
      const filteredOptions = col.filterDetails
        ? col.filterDetails
            .map((option) => ({
              id: option.id,
              name: option.name,
              code: option.code,
            }))
            .filter((option) => option)
        : [];
      return (
        <Grid key={id} item xs={12} md={6}>
        
          <Autocomplete
            name={`filters`}
            options={filteredOptions} // Remove the multiple and freeSolo props
            autoHighlight
            getOptionLabel={(option) => option.name} // Use the name property as the option label
  getOptionSelected={(option, value) => option.id === value.id} // Define the equality test based on the "id" property
  isOptionEqualToValue={(option, value) => option?.id === value?.id} // Custom equality test
  renderOption={(props, option) => {
    console.log(option); // Log the option object
    return (
      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        <span
          style={{
            backgroundColor: option?.code, // Assuming option.name contains a color value like "#RRGGBB"
            width: 25,
            height: 25,
            borderRadius: 50,
            display: 'inline-block',
            marginRight: 15, // Optional spacing between the color circle and the text
          }}
        ></span>
        {option.name}
      </Box>
    );
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={col.filterMaster ? col.filterMaster.name : ""}
      // error={categoryError && !selectedCategory} // Set error if category is not selected and field is required
      // helperText={categoryError && !selectedCategory ? "Category is required" : ""}
      inputProps={{
        ...params.inputProps,
        // autoComplete: 'new-password', // disable autocomplete and autofill
      }}
    />
  )}
  onChange={(e, newValue) => {
    const selectedValue = newValue?.id;
    handleFilterColorChange(selectedValue, newValue); // Send index and value to the function
  }}

/>
        
        </Grid>
      );
    }
    return null;
  })} */}
              {/* </>:
              

              <>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Choose Categories Then Choose  Filters")} 
          </Typography>

         <CircularProgress />
     </>} */}
  

          
              
             
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
      <FormControlLabel
      control={<Switch checked={isFoodStaff} onChange={handleSwitchChange} />}
      label={t("is Food Staff")}
      sx={{ flexGrow: 1, pl: 3 }}
    />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentBusiness ? t("Create Store") : t("Save Changes")}
        </LoadingButton>
      </Grid>
    </>
  );

  return <>
   {isSubmitting?<>
      <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
    </>:<>
    
    </>}
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}
        {renderFilters}
        {renderlinkes}
        {renderActions}
      </Grid>
    </FormProvider>
  </>
 
  
}

BusinessNewEditForm.propTypes = {
  currentBusiness: PropTypes.object,
};
