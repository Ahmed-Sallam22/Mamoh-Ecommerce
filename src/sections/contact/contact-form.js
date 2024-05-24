
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// routes
import { useRouter } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';


import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { m } from 'framer-motion';

import FormProvider, {

  RHFTextField,
} from 'src/components/hook-form';
import { settings } from 'nprogress';

import Iconify from 'src/components/iconify';
import { Link } from 'react-router-dom';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { endpoints } from 'src/utils/axios';
import axios from 'axios';
import { MotionViewport, varFade } from 'src/components/animate';


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function ContactForm() {
  const {user} = useMockedUser()
  

  const { enqueueSnackbar } = useSnackbar();



  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('name is required').max(100, "Name must be at most 100 characters").matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, 'Please enter at least one character')
    ,
    email: Yup.string().required('email is required').matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    ),
    message: Yup.string().required('message is required')
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, 'Please enter at least one character'),
    
    subject: Yup.string()
    .required("Subject is required")
    .matches(/^([a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+[\s\p{P}]*)|([\s\p{P}]*[a-zA-Z\u0600-\u06FF]+)$/, 'Please enter at least one character').max(100, "Subject must be at most 100 characters"),
    
  });


  const defaultValues = useMemo(
    () => ({
      name: user?.displayName || '' ,
      email: user?.email || '',
      subject: '',
      message:'',
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    trigger,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

 

  const onSubmit = handleSubmit(async (data) => {
    try {
     
      const response = await axios.post(
        `https://tapis.ma-moh.com/${endpoints.post.create}`,
        data,
       
      );
      enqueueSnackbar("The Messaga is sent");
      reset();
      // router.push(paths.dashboard.product.root);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });
 



  const renderDetails = (
    <>
    

      <Grid  xs={12} md={12}>
      <Stack component={MotionViewport} spacing={3}>



<m.div variants={varFade().inUp}>
        <Stack style={{ textAlign: 'center' }}>
     
      
      <Typography variant="subtitle">{t(" an")}</Typography>
        </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>

      <Stack spacing={1.5}>
        <RHFTextField name="name" label="Full Name *"  onKeyUp={() => trigger("name")}   onBlur={() => trigger("name")}                InputLabelProps={{ shrink: true }}
/>
        </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>

        <Stack spacing={1.5}>
        <RHFTextField name="email" label="Email *"    onKeyUp={() => trigger("email")}   onBlur={() => trigger("email")}              InputLabelProps={{ shrink: true }}
/>
        </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>

        <Stack spacing={1.5}>
        <RHFTextField name="subject" label="Subject Message *"    onBlur={() => trigger("subject")} // Trigger validation on blur
          inputProps={{ maxLength: 100 }} // Limit input length to 100 characters
          onKeyUp={() => trigger("subject")}               InputLabelProps={{ shrink: true }}
          />
        </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>

        <Stack spacing={1.5}>
        <RHFTextField name="message" label="Message *"  onBlur={() => trigger("message")}     inputProps={{ maxLength: 750 }}     onKeyUp={() => trigger("message")}            InputLabelProps={{ shrink: true }}
multiline rows={4} />
        </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>


        <Stack style={{ textAlign: 'center' }}>
     
      
     <Typography variant="subtitle">Follow us For more</Typography>
  <Grid spacing={2}>
<Link style={{ paddingLeft: '5px', paddingRight: '5px' }}>
     <Iconify
            width={24}
            icon="eva:facebook-fill"
            color="#1877F2"
          />
          </Link>


          <Link style={{ paddingLeft: '5px', paddingRight: '5px' }}>

     <Iconify
            width={24}
            icon="ant-design:instagram-fill"
            color="#DF3E30"
          />
                        </Link>

          <Link style={{ paddingLeft: '5px', paddingRight: '5px' }}>

     <Iconify
            width={24}
            icon="eva:linkedin-fill"
            color="#006097"
          />
                        </Link>

          <Link style={{ paddingLeft: '5px', paddingRight: '5px' }}>

     <Iconify
            width={24}
            icon="eva:twitter-fill"
            color="#1C9CEA"
          />
                        </Link>

                </Grid>

       </Stack>
       </m.div>


      

        

       <m.div variants={varFade().inUp}>

        <LoadingButton
      type="submit"
      variant="contained"
      size="large"
      loading={isSubmitting}
      sx={{ ml: 2 }}
    >
          Submit Now
    </LoadingButton>
      
    </m.div>
    </Stack>
        
      </Grid>
    
    </>
  );



 


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
      
        heading="Contact Us"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Contact Us',
            // href: paths.dashboard.post.root,
          },
        
        ]}
    
        
      />
          <FormProvider  methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>

      
    </FormProvider>

    

    </Container>
  );
}

