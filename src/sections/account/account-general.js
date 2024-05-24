import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
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

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useMockedUser();

  const UpdateUserSchema = Yup.object().shape({
    full_name: Yup.string()
    .required('Name is required')
    .matches(/^(?![\s])[a-zA-Z\s]{3,40}$/, 'Name cannot start with a special character and must be between 3 to 40 characters long')
    .min(3, 'Name must be at least 3 characters')
    .max(40, 'Name must not exceed 40 characters'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    mobile: Yup.string()
    .required("Mobile number is required")
    .matches(
      /^\d{8,15}$/, 
      "Invalid phone number , Number must start with your country Code "
    ),
    country_id: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    // state: Yup.string().required('State is required'),
    city_id: Yup.string().required('City is required'),

  });

  const defaultValues = {
    full_name: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    mobile: user?.phoneNumber || '',
    country_id: user?.country || '',
    address: user?.address || '',
    region_id: user?.state || '',
    city_id: user?.city || '',  

  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;
  const router = useRouter();
  const auth = useAuthContext();
  const onSubmit = handleSubmit(async (datavalue) => {
      try {
        const response = await axios.post(
                `https://tapis.ma-moh.com${endpoints.user.update}`,
                datavalue,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${auth?.user?.accessToken}`,
                  },
                }
              );
              if(response.status==200){
                          enqueueSnackbar(" user data updated successfully!");
                                // router.push(paths.dashboard.root);
              }
              else{
                        //   enqueueSnackbar(" user data updated successfully!");

              }
        // const {success ,data} = await updateuserData(
        //   user.id,
        //   datavalue
        // );
        // if (success) {
        // } else {
        //   console.error("Failed to update user:", data.error);
        // }
      } catch (error) {
        console.error("An error occurred during user update:", error);
      }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const [counteries, setCounteries] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://tapis.ma-moh.com/api/countries', {
       
        });

        setCounteries(response.data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
    if (user?.country) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://tapis.ma-moh.com/api/cities?&country_id=${user?.country}`);
          setCities(response.data.data);
          setSelectedCountry(user?.country);
          setSelectedCity(user?.city);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
    
      fetchCities();
    }
  }, []);
  const handleCountryChange = async (e) => {
    
    const countryId = parseInt(e.target.value, 10);
    setValue('country_id',countryId)

    setSelectedCountry(countryId);
    handlereigionChange(countryId)
    // Fetch the list of cities based on the selected country
    try {
      const response = await axios.get(`https://tapis.ma-moh.com/api/cities?&country_id=${countryId}`, {
     
      });

      setCities(response.data.data);

    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  const handleCityChange = (e) => {
    const cityId = parseInt(e.target.value, 10);
    setSelectedCity(cityId);
    setValue('city_id', cityId); 
  };
  const [Rigion, setRigion] = useState();
  const handlereigionChange = async (countryId) => {    
    try {
      const response = await axios.get(`https://tapis.ma-moh.com/api/regions?active=1&country_id=${countryId}`, {
     
      });
      setRigion(response.data.data);

    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  const [SelectedRegion, setSelectedRegion] = useState();
  const handleRegionChange = (e) => {
    const RegionId = parseInt(e.target.value, 10);
    setSelectedRegion(RegionId);
    setValue('region_id', RegionId); 
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

         
         
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="full_name" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="mobile" label="Phone Number" onBlur={() => trigger("mobile")} // Trigger validation on blur
              onKeyUp={() => trigger("mobile")} />
              <RHFTextField name="address" label="Address" />

              <RHFSelect
        native
        name="country_id"
        label="Country"
        value={selectedCountry}
        InputLabelProps={{ shrink: true }}
        onChange={handleCountryChange}
      >
          <option value="" disabled selected>Please select Your Country</option> {/* Default option */}

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
      label="City"
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
      label="City"
      value="" 
      InputLabelProps={{ shrink: true }}
      disabled 
    >
      <option>No cities available</option>
    </RHFSelect>
  )}
</>
      <>
  {Rigion?.length > 0 ? (
    <RHFSelect
      native
      name="region_id" 
      label="Region"
      value={SelectedRegion}
      onChange={handleRegionChange}
      InputLabelProps={{ shrink: true }}
    >
      <option value="" disabled>Please select a Region</option> 
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
      label="Region"
      value="" 
      InputLabelProps={{ shrink: true }}
      disabled 
    >
      <option>No Regions available</option>
    </RHFSelect>
  )}
</>
              {/* <RHFTextField name="zipCode" label="Zip/Code" type='number'  onBlur={() => trigger("zipCode")} 
              inputProps={{ maxLength: 5 }} 
              onKeyUp={() => trigger("zipCode")} /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton disabled type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
