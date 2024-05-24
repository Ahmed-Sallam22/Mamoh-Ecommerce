import PropTypes from "prop-types";
import { useState,useCallback, useEffect } from "react";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import Container from "@mui/material/Container";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useLocales } from "src/locales";
import ProductInfo from "./Product_info";
import AddSubImages from "./Add_SubImages";
import Properties from "./Properties";
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';
import Fillters from "./Filletrs";


export default function ProductNewEditForm({ currentProduct }) {
  const {t}=useLocales()

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState(t("product_info"));
  const [info, setinfo] = useState();
  const [images, setimages] = useState();
  const [properties, setproperties] = useState();
  const [Fillter, setFillter] = useState();
  const handleChangeTab = (tabName) => {
    setCurrentTab(tabName);
  };
  const handleChangeTab2 = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const [formsData, setFormsData] = useState(null); // State to hold the forms object

  const handelproperties = (properties) => {
    setproperties(properties);
  };
  const handleinfo = (info) => {
    setinfo(info);
  };
  const handelimages = (images) => {
    setimages(images);
  };
  const handelFillters = (Fillter) => {
    setFillter(Fillter);
  };
  useEffect(() => {
    if(info!==undefined ||images!==undefined ||properties!==undefined||Fillter!==undefined){
      const forms = { ...info, ...images,...properties };
      console.log(forms);
      setFormsData(forms)
    }
   
  }, [info,images,properties]);


 const TABS = [
  {
    value: "product_info",
    label: "Product Identity",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'add_Images',
    label: 'Add Images',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: "Properties",
    label: "Properties",
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: "Filters",
    label: "Filters",
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },

];
return (
  <Container  maxWidth={settings.themeStretch ? false : "lg"}>

    <Tabs
      value={currentTab}
      onChange={handleChangeTab2}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          sx={{
            color: '#203F77', // Set the text color to #203F77
            borderBottomColor: '#203F77', // Set the border color to #203F77
           
          }}
          // icon={tab.icon}
          value={tab.value}
        />
      ))}
    </Tabs>
      
    {currentTab === "product_info" && <ProductInfo oldDate={info}  handleinfo={handleinfo} handleChangeTab={handleChangeTab} currentProduct={currentProduct} />}

    {currentTab === 'add_Images' &&  <AddSubImages oldData={images} handelimages={handelimages} handleChangeTab={handleChangeTab} currentProduct={currentProduct}/>}
    {currentTab === 'Properties' &&  <Properties  oldData={properties}  handelproperties={handelproperties} handleChangeTab={handleChangeTab} currentProduct={currentProduct}/>}


    {currentTab === "Filters" && <Fillters properties={properties} formsData={formsData} currentProduct={currentProduct}/>}

  

  
    
  </Container>
);

}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
