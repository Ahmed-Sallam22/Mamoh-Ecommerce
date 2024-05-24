import { useMemo } from "react";
// routes
import { paths } from "src/routes/paths";
// locales
import { useLocales } from "src/locales";
import SvgColor from "src/components/svg-color";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const auth = useAuthContext();

  const icon = (name) => (
    <SvgColor
      src={`/assets/icons/navbar/${name}.svg`}
      sx={{ width: 1, height: 1 }}
    />
  );
  
  const ICONS = {
    job: icon("ic_job"),
    blog: icon("ic_blog"),
    user: icon("ic_label"),
    lock: icon("ic_lock"),
    tour: icon("ic_tour"),
    order: icon("ic_order"),
    delivery: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="28"
        viewBox="0 0 30 32"
      >
        <path fill="currentColor" d="M4 16h12v2H4zm-2-5h10v2H2z" />
        <path
          fill="currentColor"
          d="m29.919 16.606l-3-7A.999.999 0 0 0 26 9h-3V7a1 1 0 0 0-1-1H6v2h15v12.556A3.992 3.992 0 0 0 19.142 23h-6.284a4 4 0 1 0 0 2h6.284a3.98 3.98 0 0 0 7.716 0H29a1 1 0 0 0 1-1v-7a.997.997 0 0 0-.081-.394M9 26a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m14-15h2.34l2.144 5H23Zm0 15a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m5-3h-1.142A3.995 3.995 0 0 0 23 20v-2h5Z"
        />
      </svg>
    ),
  
    label: icon("ic_label"),
    folder: icon("ic_folder"),
    banking: icon("ic_banking"),
    booking: icon("ic_booking"),
    invoice: icon("ic_invoice"),
    product: icon("ic_product"),
    disabled: icon("ic_disabled"),
    external: icon("ic_external"),
    menuItem: icon("ic_menu_item"),
    ecommerce: icon("ic_ecommerce"),
    analytics: (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
  opacity="0.6"
  
  fill="#666666"
  d="M18.9272 5.33141C18.03 4.4252 16.9629 3.70486 15.7869 3.21163C14.611 2.7184 13.3493 2.46198 12.0741 2.45703H12C9.41414 2.45703 6.93419 3.48426 5.10571 5.31274C3.27723 7.14122 2.25 9.62117 2.25 12.207V17.457C2.25 18.0538 2.48705 18.6261 2.90901 19.048C3.33097 19.47 3.90326 19.707 4.5 19.707H6C6.59674 19.707 7.16903 19.47 7.59099 19.048C8.01295 18.6261 8.25 18.0538 8.25 17.457V13.707C8.25 13.1103 8.01295 12.538 7.59099 12.116C7.16903 11.6941 6.59674 11.457 6 11.457H3.78375C3.92839 9.89322 4.51578 8.40303 5.47709 7.16113C6.43839 5.91923 7.73377 4.97706 9.21141 4.44506C10.689 3.91306 12.2877 3.81327 13.82 4.15738C15.3524 4.50149 16.7548 5.27525 17.8631 6.38797C19.2177 7.7495 20.0509 9.54365 20.2172 11.457H18C17.4033 11.457 16.831 11.6941 16.409 12.116C15.9871 12.538 15.75 13.1103 15.75 13.707V17.457C15.75 18.0538 15.9871 18.6261 16.409 19.048C16.831 19.47 17.4033 19.707 18 19.707H20.25C20.25 20.3038 20.0129 20.8761 19.591 21.298C19.169 21.72 18.5967 21.957 18 21.957H12.75C12.5511 21.957 12.3603 22.036 12.2197 22.1767C12.079 22.3174 12 22.5081 12 22.707C12 22.9059 12.079 23.0967 12.2197 23.2374C12.3603 23.378 12.5511 23.457 12.75 23.457H18C18.9946 23.457 19.9484 23.0619 20.6517 22.3587C21.3549 21.6554 21.75 20.7016 21.75 19.707V12.207C21.7549 10.9316 21.5081 9.6678 21.0237 8.48796C20.5393 7.30811 19.8268 6.23544 18.9272 5.33141ZM6 12.957C6.19891 12.957 6.38968 13.036 6.53033 13.1767C6.67098 13.3174 6.75 13.5081 6.75 13.707V17.457C6.75 17.6559 6.67098 17.8467 6.53033 17.9874C6.38968 18.128 6.19891 18.207 6 18.207H4.5C4.30109 18.207 4.11032 18.128 3.96967 17.9874C3.82902 17.8467 3.75 17.6559 3.75 17.457V12.957H6ZM18 18.207C17.8011 18.207 17.6103 18.128 17.4697 17.9874C17.329 17.8467 17.25 17.6559 17.25 17.457V13.707C17.25 13.5081 17.329 13.3174 17.4697 13.1767C17.6103 13.036 17.8011 12.957 18 12.957H20.25V18.207H18Z" fill="#333333"/>
  </svg>
    ),
    dashboard: icon("ic_dashboard"),
    chat: icon('ic_chat'),
  
    Bussiness: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.2"
          d="M21 9.20703V10.707C21 11.5027 20.6839 12.2657 20.1213 12.8284C19.5587 13.391 18.7956 13.707 18 13.707C17.2044 13.707 16.4413 13.391 15.8787 12.8284C15.3161 12.2657 15 11.5027 15 10.707V9.20703H9V10.707C9 11.5027 8.68393 12.2657 8.12132 12.8284C7.55871 13.391 6.79565 13.707 6 13.707C5.20435 13.707 4.44129 13.391 3.87868 12.8284C3.31607 12.2657 3 11.5027 3 10.707V9.20703L4.34438 4.50078C4.38904 4.3446 4.48321 4.20715 4.61272 4.10909C4.74222 4.01103 4.90006 3.95767 5.0625 3.95703H18.9375C19.1004 3.95706 19.2589 4.01014 19.389 4.10825C19.519 4.20635 19.6136 4.34414 19.6584 4.50078L21 9.20703Z"
          fill="#666666"
        />
        <path
          d="M21.75 9.20703C21.7504 9.1373 21.7409 9.06786 21.7219 9.00078L20.3766 4.29453C20.2861 3.98226 20.0971 3.70762 19.8378 3.51162C19.5784 3.31562 19.2626 3.20877 18.9375 3.20703H5.0625C4.73741 3.20877 4.4216 3.31562 4.16223 3.51162C3.90287 3.70762 3.71386 3.98226 3.62344 4.29453L2.27906 9.00078C2.2597 9.06782 2.24991 9.13725 2.25 9.20703V10.707C2.25 11.2892 2.38554 11.8634 2.6459 12.3841C2.90625 12.9048 3.28427 13.3577 3.75 13.707V19.707C3.75 20.1049 3.90804 20.4864 4.18934 20.7677C4.47064 21.049 4.85218 21.207 5.25 21.207H18.75C19.1478 21.207 19.5294 21.049 19.8107 20.7677C20.092 20.4864 20.25 20.1049 20.25 19.707V13.707C20.7157 13.3577 21.0937 12.9048 21.3541 12.3841C21.6145 11.8634 21.75 11.2892 21.75 10.707V9.20703ZM5.0625 4.70703H18.9375L20.0081 8.45703H3.99469L5.0625 4.70703ZM9.75 9.95703H14.25V10.707C14.25 11.3038 14.0129 11.8761 13.591 12.298C13.169 12.72 12.5967 12.957 12 12.957C11.4033 12.957 10.831 12.72 10.409 12.298C9.98705 11.8761 9.75 11.3038 9.75 10.707V9.95703ZM8.25 9.95703V10.707C8.25 11.3038 8.01295 11.8761 7.59099 12.298C7.16903 12.72 6.59674 12.957 6 12.957C5.40326 12.957 4.83097 12.72 4.40901 12.298C3.98705 11.8761 3.75 11.3038 3.75 10.707V9.95703H8.25ZM18.75 19.707H5.25V14.382C5.4969 14.4318 5.74813 14.4569 6 14.457C6.58217 14.457 7.15634 14.3215 7.67705 14.0611C8.19776 13.8008 8.6507 13.4228 9 12.957C9.3493 13.4228 9.80224 13.8008 10.3229 14.0611C10.8437 14.3215 11.4178 14.457 12 14.457C12.5822 14.457 13.1563 14.3215 13.6771 14.0611C14.1978 13.8008 14.6507 13.4228 15 12.957C15.3493 13.4228 15.8022 13.8008 16.3229 14.0611C16.8437 14.3215 17.4178 14.457 18 14.457C18.2519 14.4569 18.5031 14.4318 18.75 14.382V19.707ZM18 12.957C17.4033 12.957 16.831 12.72 16.409 12.298C15.9871 11.8761 15.75 11.3038 15.75 10.707V9.95703H20.25V10.707C20.25 11.3038 20.0129 11.8761 19.591 12.298C19.169 12.72 18.5967 12.957 18 12.957Z"
          fill="#666666"
        />
      </svg>
    ),
  };

  const data = useMemo(() => {
    const GeneralItems = [
      {
        title: t("app"),
        path: paths.dashboard.general.app,
        icon: ICONS.dashboard,
      },

      {
        title: t("user"),
        path: paths.dashboard.user.root,
        icon: ICONS.user,
      },
      
      {
        title: t("Stores"),
        path: paths.dashboard.Stores.root,
        icon: ICONS.Bussiness,
      },
    ];
   
    const    MarketItems = [
       
      {
        title: t("Market Product"),
        path: paths.dashboard.Market_product.root,
        icon: ICONS.ecommerce,
      },
    
     
      {
        title: t("Market order"),
        path: paths.dashboard.Marketorder.root,
        icon: ICONS.order,
      },
      
      {
        title: t("Market invoice"),
        path: paths.dashboard.Marketinvoice.root,
        icon: ICONS.invoice,
      },
      
     
     
   
    ];
    const   FoodItems = [
      {
        title: t("Food product"),
        path: paths.dashboard.product.root,
        icon: ICONS.product,
      },
      {
        title: t("Food order"),
        path: paths.dashboard.Foodorder.root,
        icon: ICONS.order,
      },
      {
        title: t("Food invoice"),
        path: paths.dashboard.Foodinvoice.root,
        icon: ICONS.invoice,
      },
   
    ];
    const  contactItems = [
      {
        title: t("chat"),
        path: paths.dashboard.chat.root,
        icon: ICONS.chat,
      },
      {
        title: t("Contact"),
        path: paths.dashboard.contact.root,
        icon: ICONS.analytics,
      },
    ];
    const  DeleiveryItems = [
      {
        title: t("order delivery"),
        path: paths.dashboard.orderDelivery.root,
        icon: ICONS.delivery,
      },
      {
        title: t("invoice delivery"),
        path: paths.dashboard.invoiceDelivery.root,
        icon: ICONS.delivery,
      },
    ];
    const sections = [
      {
        subheader: t("General Sections"),
        items: GeneralItems,
      },
      {
        subheader: t("Market Sections"),
        items: MarketItems,
      },
      {
        subheader: t("Food Sections"),
        items: FoodItems,
      },
      {
        subheader: t("Deleivery Sections"),
        items: DeleiveryItems,
      },
      {
        subheader: t("Contact_us Sections"),
        items: contactItems,
      },
    ];
    
    const filteredSections = sections.filter(section => {
      if (auth?.user?.business_owner === 1 && auth?.user.is_delivery === 0) {
        return section.subheader !== t("Deleivery Sections"); // Exclude Delivery section for business owners
      }
      if (auth?.user?.business_owner === 0 && auth?.user.is_delivery === 1) {

        return section.subheader === t("Deleivery Sections") || section.subheader === t("General Sections"); // Include Delivery and General Sections for delivery personnel
      }
      if (auth?.user?.business_owner === 1 && auth?.user.is_delivery === 1) {
        return sections; // Return all sections for business owners who are also delivery personnel
      }
    });
    
    return filteredSections;;
  }, [t, auth?.user?.business_owner, auth?.user?.is_delivery, ICONS]);

  return data;
}


