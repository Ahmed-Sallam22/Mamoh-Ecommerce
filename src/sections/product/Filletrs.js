import * as Yup from "yup";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// utils
import { fData } from "src/utils/format-number";
// assets
import CardHeader from "@mui/material/CardHeader";

import InputAdornment from "@mui/material/InputAdornment";

import { countries } from "src/assets/data";
// components
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from "src/components/hook-form";
import { updateuserData } from "src/api/user";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useAuthContext } from "src/auth/hooks";
import { endpoints, sender } from "src/utils/axios";
import axios from "axios";
import { useLocales } from "src/locales";
import { useResponsive } from "src/hooks/use-responsive";
import AddSubImages from "./Add_SubImages";
import { useGETFillterColor } from "src/api/product";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Chip } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getValue } from "@mui/system";


export default function Fillters({ formsData, handleinfo, currentProduct }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const mdUp = useResponsive("up", "md");
  const { user } = useMockedUser();
   const [repetitions, setRepetitions] = useState([
    { id: 0, child: [{ idchild: 0 }] },
  ]);

  const UpdateUserSchema = Yup.object().shape({
    // product_filters: repetitions.map((re)=>({
    //     image: Yup.string().required("Image is required"), // Validate image as a required string
    //     filters: Yup.string().required("Filters are required"), // Validate filters as a required string
    //     sub_filters:re?.child.map((rc) => ({
    //         filters: Yup.string().required("Sub-filters are required"), // Validate sub-filters as required strings
    //         price: Yup.number().required("Price is required"), // Validate price as a required number
    //         price_before_discount: Yup.number().required("Price before discount is required"), // Validate price_before_discount as a required number
    //         qty: Yup.number().required("Quantity is required"), // Validate qty as a required number
    //       })
    //     ),
    //   })
    // )
  });

  const [CategoriesID, setCategoriesID] = useState();
  const defaultValues = useMemo(
    () => ({
      // Initialize default values based on the array of objects
      product_filters: currentProduct?.product_filters?.map((re) => ({
        image: re?.image, // Set default image value
        filters: "", // Set default filters value
        is_parent:1,
        sub_filters: re?.sub_filters?.map((rc) => ({
          filters: "", // Set default filters value for sub-filters
          price: rc?.price||0, // Set default price value
          price_before_discount: rc?.price_before_discount||0, // Set default price before discount value
          qty: rc?.qty||0, // Set default quantity value
        })),
      })),
    }),
    [currentProduct, repetitions] // Include currentProduct and repetitions in dependencies
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
    // Trigger form validation
    const isValid = await trigger();
    if (isValid) {
      const formData = methods.getValues(); // Get form values
      handleinfo(formData);
    }
  };
  const { Colors } = useGETFillterColor(CategoriesID, 8);
  console.log(Colors);

  async function handleDropCover(acceptedFiles, index) {
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
      setValue(`product_filters[${index}][is_parent]`, 1);

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
        setValue(`product_filters[${index}][is_parent]`, 1);
        setValue(`product_filters[${index}][image]`, newFile);
      }
    }
  }
  const [selectedFilters, setSelectedFilters] = useState();
  const handleFilterChange = (newValue, index, indexChild) => {
    setValue(`product_filters[${index}][sub_filters[${indexChild}][filters]]`, newValue);

  };

  const handleDeleteFilter = (filterToDelete) => () => {
    setSelectedFilters((prevFilters) =>
      prevFilters.filter(
        (filter) =>
          !(
            filter.indexChild === filterToDelete?.indexChild &&
            filter?.id === filterToDelete?.id
          )
      )
    );
  };

  const handleFilterColorChange = (newValue, index) => {
    console.log(index);
    setValue(`product_filters[${index}][filters]`, newValue);
  };

  useEffect(() => {
    if (currentProduct) {
      // setRepetitions(currentProduct?.product_filters?.length)
      reset(defaultValues);
      
    }
  }, [currentProduct, defaultValues, reset,Colors]);
  useEffect(() => {
    if (currentProduct&&formsData==null) {
      // setRepetitions(currentProduct?.product_filters?.length)
      const Categories = currentProduct.categories.map(
        category => category.id
      );
      setCategoriesID(Categories.join(','))
      reset(defaultValues);      
    }
    if(formsData!==null){
      if(formsData?.category){
        setCategoriesID(`${formsData?.category}`)
      }
      if(formsData?.category&&formsData?.Subcategory){
        setCategoriesID(`${formsData?.category},${formsData?.Subcategory}`)
      }
      if(formsData?.category&&formsData?.Subcategory&&formsData?.SubChaincategory){
        setCategoriesID(`${formsData?.category},${formsData?.Subcategory}.${formsData?.SubChaincategory}`)
      }
      if(formsData?.category&&formsData?.Subcategory&&formsData?.SubChaincategory&&formsData?.SubChaincategory2){
        setCategoriesID(`${formsData?.category},${formsData?.Subcategory},${formsData?.SubChaincategory},${formsData?.SubChaincategory2}`)
      }
    

    }
  }, [currentProduct, defaultValues, reset]);
  useEffect(() => {
    if (currentProduct) {
    
      for (let index = 1; index < currentProduct?.product_filters?.length; index++) {
        handleRepeat()
      }      
    }
  }, [currentProduct]);

  const [open, setOpen] = React.useState(false);
  const [price_before_discount, setprice_before_discount] = useState(null);
  const [price, setprice] = useState(null);
  const [messageError, setmessageError] = useState('');
  

  const onSubmit = handleSubmit(async (data) => {
  //  const datasent={...data}
  console.log(data);
    const product_filters= data?.product_filters.filter(item => item.image !== undefined && item.filters !== undefined);
    console.log(product_filters);
    const combinedData = { product_filters, ...formsData };
    console.log(combinedData);

    if (currentProduct) {
      const URL = [
        endpoints.product.update + "/" + currentProduct.id,
        combinedData,
      ];
      try {
        const res = await sender(URL);
        if (res.message === "Updated Successfully" || res.message==="تم التحديث بنجاح") {
          enqueueSnackbar(" Product updated successfully!");
          router.push(paths.dashboard.product.root);
        } else {
          enqueueSnackbar("Error ", { variant: "error" });
          console.error("Failed to update Product:");
        }
      } catch (error) {
        enqueueSnackbar("Error ", { variant: "error" });
        console.error("An error occurred during business update:", error);
      }
    } else {
      try {
        setOpen(true)
        const response = await axios.post(
          `https://tapis.ma-moh.com${endpoints.product.create}`,
          combinedData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth?.user?.accessToken}`,
            },
          }
        );
        console.log(response);
        
        setOpen(false)
        enqueueSnackbar("Create success!");
        reset();
        router.push(paths.dashboard.Market_product.root);
        console.info("DATA", data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.response?.data?.errors, { variant: "error" });
      }
    }
  });


  const handleRepeat = () => {
    const lastValue = repetitions[repetitions.length - 1];
    const newId = lastValue.id + 1;
  
    // Check if the new ID is already in the array
    if (!repetitions.find((item) => item.id === newId)) {
      const updatedRepetitions = [
        ...repetitions,
        { id: newId, child: [{ idchild: 1 }] }, // Assuming child is initialized with [1]
      ];
      setRepetitions(updatedRepetitions);
    } else {
      console.log("New ID already exists in the array.");
    }
  };
  
 const handleRepeatChild = (parentIndex) => {
  const parentItem = repetitions.find((item) => item.id === parentIndex);

  if (parentItem) {
    // Find the maximum idchild within the parent's child array
    const maxIdChild = Math.max(...parentItem.child.map(child => child.idchild), 0);
    const newChildId = maxIdChild + 1;
    const newChild = { idchild: newChildId }; // Creating a new child object with idchild

    const updatedRepetitions = repetitions.map((item) => {
      if (item.id === parentIndex) {
        return {
          ...item,
          child: [...item.child, newChild], // Adding the new child to the array
        };
      }
      return item;
    });

    setRepetitions(updatedRepetitions);
  } else {
    console.log("Parent ID not found in repetitions array.");
  }
};


const handleDecreaseChild = (parentId, childId) => {
  const updatedRepetitions = repetitions.map((item) => {
    if (item.id === parentId) {
      const updatedChild = item.child.filter((child) => child.idchild !== childId);
      return {
        ...item,
        child: updatedChild,
      };
    }
    return item;
  });
  
  // Assuming repetitions is a state variable, update it with the new array
  setRepetitions(updatedRepetitions);
};

  const handleDecrease = (itemToDelete) => {
    const updatedRepetitions = repetitions.filter(
      (item) => item.id !== itemToDelete
    );

    setRepetitions(updatedRepetitions);
  };
  const handleClick = () => {
    router.push(paths.dashboard.Market_product.root);
  };
  

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
      {repetitions.map((re, index) => (
        <React.Fragment key={re?.id}>
          {mdUp && (
            <Grid sx={{ my: 2.5 }} md={4}>
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
                    md: "30% 70%",
                  }}
                >
                  <RHFUploadAvatar
                    name={`product_filters[${index}][image]`}
                    maxSize={3145728}
                    onDrop={(acceptedFiles) =>
                      handleDropCover(acceptedFiles, index)
                    }
                  />

                  <Box
                    columnGap={0}
                    rowGap={0}
                    display="grid"
                    gridTemplateRows={{
                      xs: "repeat(1, 1fr)",
                      md: "repeat(3, 1fr)",
                    }}
                  >
                    {repetitions?.length > 1 && (
                      <LoadingButton
                        onClick={() => handleDecrease(re?.id)}
                        size="medium"
                        sx={{
                          width: 200,
                          my: 1.5,
                          justifySelf: "end",
                          backgroundColor: "#373737",
                          "&:hover": {
                            backgroundColor: "#353737",
                          },
                        }}
                        variant="contained"
                      >
                        {t("Delete This Filter")}
                      </LoadingButton>
                    )}

                    {Colors?.map((col, id) => {
                      if (col.id === 10735) {
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
                              name={`product_filters[${index}][filters]`}
                              options={filteredOptions} // Remove the multiple and freeSolo props
                              autoHighlight
                              getOptionLabel={(option) => option.name} // Use the name property as the option label
                              getOptionSelected={(option, value) =>
                                option.id === value.id
                              } // Define the equality test based on the "id" property
                              isOptionEqualToValue={(option, value) =>
                                option?.id === value?.id
                              } // Custom equality test
                              renderOption={(props, option) => {
                                console.log(option); // Log the option object
                                return (
                                  <Box
                                    component="li"
                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                    {...props}
                                  >
                                    <span
                                      style={{
                                        backgroundColor: option?.code, // Assuming option.name contains a color value like "#RRGGBB"
                                        width: 25,
                                        height: 25,
                                        borderRadius: 50,
                                        display: "inline-block",
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
                                  label={
                                    col.filterMaster
                                      ? col.filterMaster.name
                                      : ""
                                  }
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
                                handleFilterColorChange(
                                  selectedValue,
                                  index,
                                  newValue
                                ); // Send index and value to the function
                              }}
                              // onBlur={() => {
                              //   setCategoryError(!selectedCategory); // Check if category is selected on blur and set error state
                              // }}
                            />
                          
                          </Grid>
                        );
                      }
                      return null;
                    })}
                  </Box>
                </Box>

                {re?.child.map((rc, indexChild) => (
                  <Box
                    key={rc?.idchild}
                    columnGap={3}
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
                        <Autocomplete
                        name={`product_filters[${index}][sub_filters[${indexChild}][filters]]`}
                        options={filteredOptions}     
                        autoHighlight
                        getOptionLabel={(option) => option.name} // Use the name property as the option label
                        getOptionSelected={(option, value) =>
                          option.id === value.id
                        } // Define the equality test based on the "id" property
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        } // Custom equality test
                          renderOption={(props, option) => (
                            <li {...props} key={option.id} value={option.name}>
                              {option.name}
                            </li>
                          )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              col.filterMaster
                                ? col.filterMaster.name
                                : ""
                            }
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
                          handleFilterChange(selectedValue, index, indexChild) // Send index and value to the function
                        }}
                     
                      />
                   
                      );
                    })}
                    <RHFTextField
                      name={`product_filters[${index}][sub_filters[${indexChild}][price]]`}
                      label={t("Product Price *")}
                      placeholder="0.00"
                      type="number"
                    
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: "text.disabled" }}
                            >
                              ₪
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
{messageError&& (
    <Typography variant="body2" color="error">
        {messageError}
    </Typography>
)}



                    <RHFTextField
                      name={`product_filters[${index}][sub_filters[${indexChild}][price_before_discount]]`}
                      label={t("Price Before Discount")}
                      placeholder="0.00"
                      type="number"
               
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: "text.disabled" }}
                            >
                              ₪
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box
                      display="grid"
                      gridTemplateColumns="70% 30%" 
                      alignItems="flex-start"
                      columnGap={2}
                    >
                      <RHFTextField
                        name={`product_filters[${index}][sub_filters[${indexChild}][qty]]`}
                        // onBlur={() =>
                        //   trigger(
                        //     `product_filters[${index}][sub_filters[${indexChild}][qty]]`
                        //   )
                        // }
                        label={t("Quantity *")}
                        // onKeyUp={() =>
                        //   trigger(
                        //     `product_filters[${index}][sub_filters[${indexChild}][qty]]`
                        //   )
                        // }
                        placeholder="0"
                        type="number"
                        inputProps={{ maxLength: 6 }}
                        InputLabelProps={{ shrink: true }}
                      />
{re?.child?.length>1?
<>
<LoadingButton
                        variant="contained"
                        sx={{
                          height: 50,
                          backgroundColor: "#FF003D",
                          "&:hover": {
                            backgroundColor: "#FF003D", 
                          },
                        }}
                        onClick={() => handleDecreaseChild(re?.id, rc?.idchild)}
                      >
                        <svg
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 7.5C11 7.5 11.5 8.5 11.5 10.5C11.5 12.5 11 13.5 11 13.5M7 7.5C7 7.5 6.5 8.5 6.5 10.5C6.5 12.5 7 13.5 7 13.5M2.99999 4C2.99999 9.85872 1.63107 18 8.99999 18C16.3689 18 15 9.85872 15 4M1 4H17M12 4V3C12 1.22496 10.3627 1 9 1C7.63731 1 6 1.22496 6 3V4"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </LoadingButton>
</>
:
<></>}
                    
                    </Box>
                  </Box>
                ))}
                {repetitions?.length > 0 ? (
                  <>
                    <>
                      {mdUp && <Grid md={4} />}
                      <Grid
                        xs={12}
                        md={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          gap: 2,
                        }}
                      >
                        <LoadingButton
                          sx={{
                            backgroundColor: "#3ED132",
                            "&:hover": {
                              backgroundColor: "#3ED132",
                            },
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRepeatChild(re?.id)}
                          variant="contained"
                        >
                          <svg
                            style={{ paddingRight: 5 }}
                            width="17"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 1.5V11.5M1 6.5H11"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          {t("Add Child Filters")}
                        </LoadingButton>
                        <LoadingButton
                          variant="body2"
                          sx={{
                            backgroundColor: "#5E5F60",
                            "&:hover": {
                              backgroundColor: "#5E5F60", // Change background color on hover
                            },
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={handleRepeat}
                        >
                          <svg
                            style={{ paddingRight: 5 }}
                            width="17"
                            height="14"
                            viewBox="0 0 12 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 1.5V11.5M1 6.5H11"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          {t("Add Parent Filters")}
                        </LoadingButton>
                      </Grid>
                    </>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            </Card>
          </Grid>
        </React.Fragment>
      ))}
      <Grid
        xs={12}
        md={12}
        sx={{
          pt: 5,
          display: "flex",
          alignItems: "self-end",
          justifyContent: "end",
        }}
      >
          <LoadingButton onClick={handleClick} type="submit" variant="contained"   sx={{ backgroundColor: "#FF003D", marginRight: 1,"&:hover": {
   backgroundColor: "#FF053D", // Same color on hover
 }, }}
>
Cancel
</LoadingButton>
        <LoadingButton type="submit" variant="contained"         loading={isSubmitting}
>
          {!currentProduct ? t("Create Product") : t("Save Changes")}
        </LoadingButton>
      </Grid>
    </FormProvider>
    </>
}
