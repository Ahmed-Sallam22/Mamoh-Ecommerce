import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { resest_password } from 'src/api/user';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/axios';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const {t}=useLocales()
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useMockedUser();

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    current_password: Yup.string().required(t('Old Password is required')),
    new_password: Yup.string()
      .required(t('New Password is required'))
      .min(6, t('Password must be at least 6 characters'))
      .test(
        t('no-match'),
        t('New password must be different than old password'),
        (value, { parent }) => value !== parent.current_password
      ),
    new_password_confirmation: Yup.string().oneOf([Yup.ref('new_password')], t('Passwords must match')),
  });

  const defaultValues = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const router = useRouter();
  const auth = useAuthContext();

  const onSubmit = handleSubmit(async (datavalue) => {
    try {
      const response = await axios.post(
        `https://tapis.ma-moh.com${endpoints.user.resete_password}`,
        datavalue,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth?.user?.accessToken}`,
          },
        }
      );
      if(response.status==200){
        enqueueSnackbar(" user Password updated successfully!");
      }
    } catch (error) {
      console.error("An error occurred during user update:", error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="current_password"
          type={password.value ? 'text' : 'password'}
          label={t('Current Password')}
            InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="new_password"
          label={t('New Password')}
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{t('Password must be minimum +6')} 
              
            </Stack>
          }
        />

        <RHFTextField
          name="new_password_confirmation"
          type={password.value ? 'text' : 'password'}
          label={t("Confirm New Password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          {t("Save Changes")}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
