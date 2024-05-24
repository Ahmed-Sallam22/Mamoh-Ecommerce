import PropTypes, { array } from "prop-types";
import * as Yup from "yup";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { FaTimes } from 'react-icons/fa'; // Import the "x" icon from react-icons
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// _mock
import {
  _tags,
  // PRODUCT_SIZE_OPTIONS,
  // PRODUCT_GENDER_OPTIONS,
  // PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from "src/_mock";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
  RHFUploadAvatar,
} from "src/components/hook-form";
import { fData } from "src/utils/format-number";
import axios from "axios";
import { useMockedUser } from "src/hooks/use-mocked-user";
import axiosInstance, { endpoints, sender, sender2 } from "src/utils/axios";
import { getValue } from "@mui/system";
import uuidv4 from "src/utils/uuidv4";
import { customAlphabet } from "nanoid";
import PickColor from 'react-pick-color';
import {
  useGetAllBusineses,
  useGetAllBusinesses,
  useGetAllCurrencies,
  useGetBusinessByCategories,
  useGetBusinessByCategorieschildrens,
  useGetBussiness,
} from "src/api/bussiness";
import { useGetCountry, useGETFillterColor, useGETFillterColorProducts } from "src/api/product";
import { useAuthContext } from "src/auth/hooks";
import { updateProduct } from "../../api/product";
import { TextField } from "@mui/material";
import ColorPicker from "react-pick-color";
import { useLocales } from "src/locales";
// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const { user } = useMockedUser();
  const auth = useAuthContext();
  const {t}=useLocales()

  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();
  const { businesses: bussines } = useGetAllBusineses();
  const { currencies } = useGetAllCurrencies();

  const NewProductSchema = Yup.object().shape({
    business_id: Yup.string().required("Business is required"),
    name: Yup.string()
      .required(t("Name is required"))
      .max(100, t("Name must be at most 100 characters"))
      .matches(
        /^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/,
        t("Please enter at least one character")
      ),
      image: Yup.mixed().required('Image is required'),  
      product_filters: Yup.array().of(
        Yup.object().shape({
          image: Yup.mixed().required('Image is required'),
          filters: Yup.string().required('Filters are required'),
          // Add validation rules for other fields like price, quantity, etc.
          sub_filters: Yup.array().of(
            Yup.object().shape({
              filters: Yup.string(),
              price:Yup.number().required(),
              price_before_discount: Yup.number()
            .positive('Price before discount must be positive')
            .test('greaterThanOrEqualToPrice', 'Price before discount must be greater than  Price', function (value) {
              const price = this.parent.price; // Get the value of price from the parent object
              return value > price || value === 0; // Allow price_before_discount to be greater than price or equal to zero
            }),
              qty: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
            })
          ),
        })
      ),
      
      // .matches(
    //   /^[a-zA-Z0-9]+$/,
    //   "Name must not contain spaces or special characters"
    // )
    // images: Yup.array().min(1, 'Images is required'),
    // categories: Yup.string().required('categories is required'),
    // category: Yup.string().required('categories is required'),
    // image: Yup.string().required("image is required"),
    // price: Yup.string()
    //   .required("Price is required")

    //   .matches(
    //     /^[1-9]\d{0,5}(\.\d{1,2})?$/,
    //     "Price must be a positive number with up to 6 digits and optionally 2 decimal places"
    //   ),
    // price_before_discount: Yup.string().matches(
    //   /^\s*$|^(0|[1-9]\d{0,5})(\.\d{1,2})?$/,
    //   "Price before discount must be a positive number with up to 6 digits or left empty, with optionally up to 2 decimal places"
    // ),
    // qty: Yup.string()
    //   .required("Price is required")
    //   .matches(
    //     /^[1-9]\d{0,5}$/,
    //     "Price must be a positive number with 1 to 6 digits"
    //   ),
    description: Yup.string()
      .required(t("description is required"))
      .max(500, t("description must be at most 500 characters"))
      .matches(
        /^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/,
        t("Please enter at least one character")
      ), // .matches(
  });
  const [bussinsselected, setbussinsid] = useState("");

  const { bussiness } = useGetBussiness(bussinsselected);
  const { country } = useGetCountry(bussiness?.country_id);

  const [formData2, setFormData] = useState({
    region_id: currentProduct?.region_id || bussiness?.region_id || null,
    country_id: currentProduct?.country_id || bussiness?.country_id || null,
    city_id: currentProduct?.city_id || bussiness?.city_id || null,
    lat: currentProduct?.lat || bussiness?.lat || null,
    lng: currentProduct?.long || bussiness?.long || null,
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      // image: currentProduct?.image || null,
      business_id: currentProduct?.business_id || "",
      business_department_id: currentProduct?.department || 5,
      // price: currentProduct?.price || null,
      // qty: currentProduct?.qty || 0,
      // price_before_discount: currentProduct?.price_before_discount || 0,
      // categories: currentProduct?.category || null,
      // category: currentProduct?.category || null,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [categoriesid, setcategoriesid] = useState(null);
  const [categoriesidParent, setcategoriesidParent] = useState(null);
  const [categoriesParent, setcategoriesParent] = useState(null);

  console.log(categoriesid,categoriesidParent);
  useEffect(() => {
    setFormData({
      region_id: currentProduct?.country_id || bussiness?.region_id || null,
      country_id: currentProduct?.country_id || bussiness?.country_id || null,
      city_id: currentProduct?.city_id || bussiness?.city_id || null,
      lat: currentProduct?.lat || bussiness?.lat || null,
      lng: currentProduct?.long || bussiness?.long || null,
      currencies: country?.currencies || 2 || null,
    });
if(categoriesid==null){
  setcategoriesidParent(null);
  setcategoriesParent(null)
}
    // Set the value of business_id to current.bussines if it exists
    if (currentProduct?.business_id) {
      setValue("business_id", currentProduct?.business_id);
    }
    if (currentProduct) {
      setPriceInput(currentProduct?.price_before_discount);
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset, bussiness,categoriesid]);

  const [priceInput, setPriceInput] = useState();

  const onSubmit = handleSubmit(async (data) => {
    setValue('categories',`${categoriesid},${categoriesidParent},${categoriesParentOfParent}`)
    const combinedData = { ...data, ...formData2  };
    console.log(combinedData);
    
    // if (currentProduct) {
    //   const URL = [
    //     endpoints.product.update + "/" + currentProduct.id,
    //     combinedData,
    //   ];
    //   try {
    //     const res = await sender(URL);
    //     if (res.message === "Updated Successfully") {
    //       enqueueSnackbar(" Product updated successfully!");
    //       router.push(paths.dashboard.Market_product.root);
    //     } else {
    //       enqueueSnackbar("Error ", { variant: "error" });
    //       console.error("Failed to update Product:", data.error);
    //     }
    //   } catch (error) {
    //     enqueueSnackbar("Error ", { variant: "error" });
    //     console.error("An error occurred during business update:", error);
    //   }
    // } else {
    //   try {
    //     const response = await axios.post(
    //       `https://tapis.ma-moh.com${endpoints.product.create}`,
    //       combinedData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           Authorization: `Bearer ${auth?.user?.accessToken}`,
    //         },
    //       }
    //     );
    //     console.log(response);
    //     enqueueSnackbar("Create success!");
    //     reset();
    //     router.push(paths.dashboard.Market_product.root);
    //     console.info("DATA", data);
    //   } catch (error) {
    //     console.error(error);
    //     enqueueSnackbar("Error ", { variant: "error" });
    //   }
    // }
  });

  async function handleDropCover(acceptedFiles,index) {
    if (currentProduct) {
      let file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      const data = {
        image_file_name: newFile,
        imageable_type: "Product",
        imageable_id: currentProduct.id,
      };
      setValue(`product_filters[${index}][is_parent]`,1)

      setValue(`product_filters[${index}][image]`, newFile.preview);
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
        setValue(`product_filters[${index}][image]`, response.data.data.image);
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
        setValue(`product_filters[${index}][is_parent]`,1)
        setValue(`product_filters[${index}][image]`, newFile);
      }
    }
  }
  async function handleDropMainCover(acceptedFiles,index) {
    if (currentProduct) {
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
 

  
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (newValue, index, indexChild) => {
    // Check if newValue is already selected in any indexChild
    const isDuplicate = selectedFilters.some(
      filter => filter.id === newValue.id && filter.indexChild !== indexChild
    );
  
    if (isDuplicate) {
      // Handle error, such as displaying a notification or setting an error state
      alert('Error: Cannot add the same ID in different indexChild');
      // You can also set an error state to display a message in your component
      // setErrorState('Cannot add the same ID in different indexChild');
  
      return; // Return early if it's a duplicate
    }
  
    setSelectedFilters(prevFilters => [
      ...prevFilters,
      { indexChild, id: newValue.id, name: newValue.name } // Assuming newValue has id and name properties
    ]);
  };
  
  
  

  const handleDeleteFilter = (filterToDelete) => () => {
    setSelectedFilters(prevFilters =>
      prevFilters.filter(filter => !(filter.indexChild === filterToDelete.indexChild && filter.id === filterToDelete.id))
    );
  };





  const handleFilterColorChange = (newValue, index) => {
    // Ensure only one option is selected
    setValue(`product_filters[${index}][filters]`, newValue?.id);

  };

  const handleCategoriesChange = (newValue) => {
    console.log(categoriesid);
    if(newValue?.id){
      setcategoriesid(newValue?.id);  
    }
    else{
      setcategoriesid(null);  

    }
  };

  const handleCategoriesChangeParent = (newValue) => {
    if(  newValue?.id){
      setcategoriesParent(newValue?.id)
      setcategoriesidParent(newValue?.id);
    }
    else{
      setcategoriesidParent(null);

    }
  };
  const [categoriesParentOfParent, setcategoriesParentOfParent] = useState(null);

  const handleCategoriesChangeParentofParent = (newValue) => {
    if(  newValue?.id){
      setcategoriesParentOfParent(newValue?.id);
    }
    else{
      setcategoriesParentOfParent(null);

    }
  };
  const { businessesCategoriesParent, businessesCategoriesParentLoading } =
    useGetBusinessByCategorieschildrens(categoriesid, categoriesParent,5);
  const { businessesCategories: Categories, businessesCategoriesLoading } =
    useGetBusinessByCategories(5);

  const { Colors } = useGETFillterColor(categoriesid,categoriesidParent, 5);
  
console.log(Colors);
 

  const [repetitions, setRepetitions] = useState(1); 
  const [repetitionsChild, setrepetitionsChild] = useState(1); 

  const handleRepeat = () => {
    setRepetitions(repetitions + 1);
    
  };
  const handleRepeatChild = () => {
   
    setrepetitionsChild(repetitionsChild + 1);
  };
  const handleDecrease = () => {
    if (repetitions > 1) {
      setRepetitions(repetitions - 1); 
    }
  };
  


  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Details")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Title, short description")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="name"
              label={t("Product Name *")}
              onBlur={() => trigger("name")} // Trigger validation on blur
              inputProps={{ maxLength: 100 }} // Limit input length to 100 characters
              onKeyUp={() => trigger("name")}
              placeholder={t("Enter Product Name")}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="description"
              label={t("Description *")}
              placeholder={t("Please Enter Product Description")}
              InputLabelProps={{ shrink: true }}
              multiline
              rows={4}
              onKeyUp={() => trigger("description")}
              onBlur={() => trigger("description")} // Trigger validation on blur
              inputProps={{ maxLength: 500 }} // Limit input length to 100 characters
            />
             <Stack>
<Typography variant="subtitle">{t("Main Images *")}</Typography>
              <RHFUploadAvatar
              
                name={`image`}
                maxSize={3145728}
                onBlur={() => trigger("image")} // Trigger validation on blur
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
          {t("Additional Categories and Stores...")}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
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
              <Controller
                name="business_id"
                control={control}
                defaultValue="" // Set the default value to an empty string
                render={({ field }) => (
                  <RHFSelect
                    native
                    label={t("Store *")}
                    {...field}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      const selectedBusinessId = e.target.value;
                      field.onChange(selectedBusinessId);
                      setbussinsid(selectedBusinessId);
                    }}
                  >
                    <option value="" selected disabled>
                    {t("Select Store")}
                    </option>
                    {bussines?.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              />
               <Controller
                name="currencies"
                control={control}
                defaultValue="" // Set the default value to an empty string
                render={({ field }) => (
                  <RHFSelect
                    native
                    label={t("Currencies *")}
                    {...field}
                    InputLabelProps={{ shrink: true }}
                   
                  >
                    <option value="" selected disabled>
                    {t("Select Currencies")}
                    </option>
                    {currencies?.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                      {currency.symbole}  {currency.name}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              />
                  <RHFAutocomplete
        name="categories"
        label="Main Categories"
        placeholder="Main Categories"
        freeSolo
        options={Categories.map((option) => ({
          id: option.id,
          name: option.name,
        }))}
        
        value={categoriesid} // Set the selected value
        onChange={(event, newValue) => handleCategoriesChange(newValue)}
        getOptionLabel={(option) => option?.name || ''}

        renderOption={(props, option) => (
          <li {...props} key={option.id} value={option?.name}>
            {option?.name}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
            {...getTagProps({ index })}
            key={index}
            label={option?.name}
            value={option.id}
            size="small"
            color="info"
            variant="soft"
          />
          ))
        }
        
      />
             {categoriesid !==null ? (
        <RHFAutocomplete
          name="SubCategories"
          label={t("SubCategories")}
          placeholder={t("SubCategories")}
          freeSolo
          options={businessesCategoriesParent.map((option) => ({
            id: option.id,
            name: option.name,
          }))}
          value={categoriesidParent}          // Set the selected value
          onChange={(event, newValue) => handleCategoriesChangeParent(newValue)}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option.id} value={option?.name}>
              {option?.name}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
              {...getTagProps({ index })}
              key={index}
              label={option?.name}
              value={option.id}
              size="small"
              color="info"
              variant="soft"
            />
            ))
          }
        />
      ) : (
        <RHFAutocomplete
          name="SubCategories"
          label={t("Select Your Categories")}
          placeholder={t("Select Your Categories")}
          freeSolo
          disabled // Disable the component when categoriesid is empty
        />
      )}
             {categoriesidParent !==null &&categoriesParent!==null ? (
      <RHFAutocomplete
      name="SubChainCategories"
      label={t("SubChainCategories")}
      placeholder={t("SubChainCategories")}
      freeSolo
      options={businessesCategoriesParent.map((option) => ({
        id: option.id,
        name: option?.name,
      }))}
      value={categoriesParentOfParent} // Set the selected value
      onChange={(event, newValue) => handleCategoriesChangeParentofParent(newValue)}
      getOptionLabel={(option) => option?.name || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.id} value={option?.name}>
          {option?.name}
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={index}
            label={option?.name}
            value={option.id}
            size="small"
            color="info"
            variant="soft"
          />
        ))
      }
    />
    
      ) : <>

      </>}
            </Box>
         
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderFilters = (
    <>
     {Array.from({ length: repetitions }).map((_, index) => (
        <React.Fragment key={index}>
          {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("Filters")} 
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("Additional Filters , price and image....")}
          </Typography>
        </Grid>
      )}

          {/* Main content section */}
          <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={2} sx={{ p: 3 }}>
          <Box
              columnGap={0}
              rowGap={0}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
 

 <Stack>
 <Typography variant="subtitle">{t("Image *")}</Typography>
              <RHFUploadAvatar
              
                name={`product_filters[${index}][image]`}
                maxSize={3145728}
                onDrop={(acceptedFiles) => handleDropCover(acceptedFiles, index)}
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
{Colors?.map((col, id) => {
 if (col.id === 10735) {
  const filteredOptions = col.filterDetails
  ? col.filterDetails
      .map((option) => ({
        id: option.id,
        name: option.name,
      }))
      .filter((option) => option)
  : [];

  return <>
<RHFAutocomplete
  key={id}
  name={`product_filters[${index}][filters]`}
  label={col.filterMaster ? col.filterMaster.name : ""}
  placeholder={col.filterMaster.name}
  options={filteredOptions} // Remove the multiple and freeSolo props
  onChange={(event, newValue) => handleFilterColorChange(newValue, index)}
  getOptionLabel={(option) => option.name} // Use the name property as the option label
  renderOption={(props, option) => (
    <li {...props} key={option.id} value={option.name}>
    <span
      style={{
        backgroundColor: option?.name, // Assuming option.name contains a color value like "#RRGGBB"
        width: 25,
        height: 25,
        borderRadius: 50,
        display: 'inline-block',
        marginRight: 15, // Optional spacing between the color circle and the text
      }}
    ></span>
    {option.name}
  </li>
  )}
  renderTags={(selected, getTagProps) =>
    selected.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        key={index}
        label={option.name}
        value={option.id}
        size="small"
        color="info"
        variant="soft"
      />
    ))
  }
/>


  </>
}            
return null
          })}
            </Box>
         
       {[...Array(repetitionsChild)].map((_, indexChild) => (
     <Box
     columnGap={2}
     rowGap={3}
     display="grid"
     gridTemplateColumns={{
       xs: "repeat(2, 1fr)",
       md: "repeat(4, 1fr)",
     }}
   >
            {Colors?.map((col, id) => {
// Skip rendering for item with id equal to 10735
if (col.id === 10735) {
return null; // Skip rendering this item
}

// Filter options with empty names and specific colors
const filteredOptions = col.filterDetails
? col.filterDetails
.map((option) => ({
 id: option.id,
 name: option.name,
}))
.filter((option) => option)
: [];

return (
<RHFAutocomplete
key={id}
name={`product_filters[${index}][sub_filters[${indexChild}][filters]]`}
label={col.filterMaster ? col.filterMaster.name : ""}
placeholder={col.filterMaster.name}
// multiple
freeSolo
options={filteredOptions}
onChange={(event, newValue) => handleFilterChange(newValue,index,indexChild)}
getOptionLabel={(option) => option.name} // Use the name property as the option label
renderOption={(props, option) => (
<li {...props} key={option.id} value={option.name}>
 {option.name}
</li>
)}
renderTags={(selected, getTagProps) =>
selected.map((option, index) => (
 <Chip
   {...getTagProps({ index })}
   key={index}
   onDelete={handleDeleteFilter(option)}
   label={option.name}
   value={option.id}
   size="small"
   color="info"
   variant="soft"
 />
))
}
/>
);
})}
                   <RHFTextField
       name={`product_filters[${index}][sub_filters[${indexChild}][price]]`}
       onBlur={() => trigger("price")}
       label={t("Product Price *")}
       onKeyUp={() => trigger("price")}
       placeholder="0.00"
       type="number"
       InputLabelProps={{ shrink: true }}
       InputProps={{
         startAdornment: (
           <InputAdornment position="start">
             <Box component="span" sx={{ color: "text.disabled" }}>
               ₪
             </Box>
           </InputAdornment>
         ),
       }}
     />

     <RHFTextField
       name={`product_filters[${index}][sub_filters[${indexChild}][price_before_discount]]`}
       label={t("Price Before Discount")}
       placeholder="0.00"
       type="number"
       InputLabelProps={{ shrink: true }}
       InputProps={{
         startAdornment: (
           <InputAdornment position="start">
             <Box component="span" sx={{ color: "text.disabled" }}>
               ₪
             </Box>
           </InputAdornment>
         ),
       }}              
     />
      <RHFTextField
       name={`product_filters[${index}][sub_filters[${indexChild}][qty]]`}
       onBlur={() => trigger("qty")} // Trigger validation on blur
       label={t("Quantity *")}
       onKeyUp={() => trigger("qty")}
       placeholder="0"
       type="number"
       inputProps={{ maxLength: 6 }}
       InputLabelProps={{ shrink: true }}
     />





</Box>
      ))}
{Colors?.length>0?<>
  <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={12} sx={{ display: "flex", alignItems: "center",justifyContent:"end",gap:2 }}>
      <LoadingButton  onClick={handleRepeatChild} variant="contained" >
        {t("Add Child Filters")}
        </LoadingButton>
      <LoadingButton variant="body2"  sx={{ backgroundColor:"#3ED132" , '&:hover': {
            backgroundColor: "#3ED142", // Change background color on hover
          },color: "white", cursor: 'pointer' }} onClick={handleRepeat}>
              {t("Add Parent Filters")}
      </LoadingButton>

     
      </Grid>
    </>
    { repetitions > 1 && (
            <LoadingButton
              variant="body2"
              onClick={handleDecrease}
              sx={{  backgroundColor: 'red',  '&:hover': {
                backgroundColor: "red", // Change background color on hover
              },color: 'white' }}
            >
              {t("Decrease Filters")}
            </LoadingButton>
          )}
</>:<></>}
 
         
           
     
          </Stack>
        </Card>
      </Grid>
        </React.Fragment>
      ))}
    
    </>
  );



  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={12} sx={{ display: "flex", alignItems: "self-end",justifyContent:"end" }}>
        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label={t("Publish")}
          sx={{ flexGrow: 1, pl: 3 }}
        /> */}

        <LoadingButton type="submit" variant="contained" size="large">
        {!currentProduct ? t("Create Product") : t("Save Changes")}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}
        {renderFilters}


        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
