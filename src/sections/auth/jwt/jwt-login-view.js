/* eslint-disable no-undef */
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useSearchParams, useRouter } from "src/routes/hooks";
import { PATH_AFTER_LOGIN } from "src/config-global";
import { useBoolean } from "src/hooks/use-boolean";
import Iconify from "src/components/iconify";
import FormProvider, { RHFAutocomplete, RHFTextField } from "src/components/hook-form";
import CountryMobileLogin from "./Code-Country-Mobail-Form";
import { useAuthContext } from "src/auth/hooks";
import axios from "axios";
import { useLocales } from "src/locales";

const JwtLoginView = () => {
  const {t}=useLocales()

  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const password = useBoolean();
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for checkbox
  const { login ,authError} = useAuthContext(rememberMe);
  // const [authError, setAuthError] = useState(''); 
  const setErrorr=''
  const LoginSchema = Yup.object().shape({
    mobile: Yup.string()
      .required(t("Mobile is required")),
    password: Yup.string().required(t("Password is required")),
    country: Yup.string().required(t("Country code is required")),
  });

  useEffect(() => {
  console.log(authError);
  }, [authError]);

  const defaultValues = {
    mobile: "",
    password: "",
    country: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    
    try {
      await login?.(data.mobile, data.password, data.countryCode,rememberMe);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      reset();
      
      setErrorMsg(error.message);
    }
    
  });

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://tapis.ma-moh.com/api/countries",
        );

        setCountries(response.data.data);
      } catch (error) {
        // Handle error
      }
    };

    fetchCountries();
  }, []);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t("Sign in to Mamoh")}</Typography>
    </Stack>
  );
  const renderForm = (
    <Stack spacing={2.5} style={{ position: "relative" }}>
      {errorMsg?<><Alert severity="error">{errorMsg}</Alert></>:null}
      {authError && <Alert severity="error">{authError}</Alert>}
      <RHFAutocomplete
        name="country"
        label={t("Country Code *")}
        onBlur={() => trigger("country")} 
        onKeyUp={() => trigger("country")}
        options={countries.map((country) => country.country_code)}
        getOptionLabel={(option) => option}
        renderOption={(props, option) => {
          const selectedCountry = countries.find(
            (country) => country.country_code === option
          );

          if (!selectedCountry) {
            return null;
          }

          const { code, id, country_code } = selectedCountry;

          return (
            <li {...props} key={id}>
              <Iconify
                key={id}
                icon={`circle-flags:${code.toLowerCase()}`}
                width={28}
                sx={{ mr: 1 }}
              />
               {country_code}
            </li>
          );
        }}
      />
      <RHFTextField
        name="mobile"
        label={t("Mobile Number *")}
        onBlur={() => trigger("mobile")} 
        onKeyUp={() => trigger("mobile")}
        error={errors.mobile !== undefined} 
        helperText={errors.mobile && errors.mobile.message} 
        InputLabelProps={{
           shrink: true ,
          style: { display: isSelectActive ? "none" : "block" },
        }}
      />
      <RHFTextField
        name="password"
        label={t("Password *")}
        onBlur={() => trigger("password")} 
        onKeyUp={() => trigger("password")}
        error={errors.password !== undefined} 
        helperText={errors.password && errors.password.message} 
        InputLabelProps={{
          shrink: true ,
          style: { display: isSelectActive ? "none" : "block" },
        }}
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack direction="row" alignItems="center">
        <input
          type="checkbox"
          id="rememberMeCheckbox"
          checked={rememberMe}
          onChange={handleRememberMeChange}
        />
        <label htmlFor="rememberMeCheckbox" style={{ marginLeft: "0.5rem", cursor: "pointer" }}>
          {t("Remember Me")}
        </label>
      </Stack>
   
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
      {t("Login")}
      </LoadingButton>
      
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
};

export default JwtLoginView;
