// utils
import { paramCase } from "src/utils/change-case";
import { _id, _postTitles } from "src/_mock/assets";

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: "/auth",
  AUTH_DEMO: "/auth-demo",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: "/coming-soon",
  
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  faqs: "/faqs",
  page403: "/403",
  page404: "/404",
  page500: "/500",
  components: "/components",
  docs: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
  zoneUI: "https://mui.com/store/items/zone-landing-page/",
  minimalUI: "https://mui.com/store/items/minimal-dashboard/",
  freeUI: "https://mui.com/store/items/minimal-dashboard-free/",
  figma:
    "https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0",
    Contact_us: {
    root: `/Contact_us`,
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      // register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/app`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/Food_product`,
      new: `${ROOTS.DASHBOARD}/Food_product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/Food_product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/Food_product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Food_product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/Food_product/${MOCK_ID}/edit`,
      },
    },
    Market_product: {
      root: `${ROOTS.DASHBOARD}/Market_product`,
      new: `${ROOTS.DASHBOARD}/Market_product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/Market_product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/Market_product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Market_product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/Market_product/${MOCK_ID}/edit`,
      },
    },

    Stores: {
      root: `${ROOTS.DASHBOARD}/Stores`,
      new: `${ROOTS.DASHBOARD}/Stores/new`,
      details: (id) => `${ROOTS.DASHBOARD}/Stores/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/Stores/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Stores/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/Stores/${MOCK_ID}/edit`,
      },
    },

    Foodinvoice: {
      root: `${ROOTS.DASHBOARD}/Foodinvoice`,
      new: `${ROOTS.DASHBOARD}/Foodinvoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/Foodinvoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/Foodinvoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Foodinvoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/Foodinvoice/${MOCK_ID}/edit`,
      },
    },
    Marketinvoice: {
      root: `${ROOTS.DASHBOARD}/Marketinvoice`,
      new: `${ROOTS.DASHBOARD}/Marketinvoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/Marketinvoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/Marketinvoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Marketinvoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/Marketinvoice/${MOCK_ID}/edit`,
      },
    },
    invoiceDelivery: {
      root: `${ROOTS.DASHBOARD}/invoiceDelivery`,
      new: `${ROOTS.DASHBOARD}/invoiceDelivery/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoiceDelivery/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoiceDelivery/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoiceDelivery/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoiceDelivery/${MOCK_ID}/edit`,
      },
    },
    chat: {
      root: `${ROOTS.DASHBOARD}/chat`,
    },
    contact: {
      root: `${ROOTS.DASHBOARD}/contact`,
    },
    
    Foodorder: {
      root: `${ROOTS.DASHBOARD}/Foodorder`,
      details: (id) => `${ROOTS.DASHBOARD}/Foodorder/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Foodorder/${MOCK_ID}`,
      },
    },
    Marketorder: {
      root: `${ROOTS.DASHBOARD}/Marketorder`,
      details: (id) => `${ROOTS.DASHBOARD}/Marketorder/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/Marketorder/${MOCK_ID}`,
      },
    },
    orderDelivery: {
      root: `${ROOTS.DASHBOARD}/orderDelivery`,
      details: (id) => `${ROOTS.DASHBOARD}/orderDelivery/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/orderDelivery/${MOCK_ID}`,
      },
    },
    delivery: {
      root: `${ROOTS.DASHBOARD}/delivery`,
      // details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },

  },
};
