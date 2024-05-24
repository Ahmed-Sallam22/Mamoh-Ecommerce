/* eslint-disable no-unused-vars */
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
// auth
import { AuthGuard } from "src/auth/guard";
// layouts
import DashboardLayout from "src/layouts/dashboard";
// components
import { LoadingScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import("src/pages/dashboard/app"));
const OverviewEcommercePage = lazy(() =>
  import("src/pages/dashboard/ecommerce")
);
const OverviewAnalyticsPage = lazy(() =>
  import("src/pages/dashboard/analytics")
);
// PRODUCT
const FoodProductDetailsPage = lazy(() =>
  import("src/pages/dashboard/FoodProduct/details")
);
const FoodProductListPage = lazy(() =>
  import("src/pages/dashboard/FoodProduct/list")
);
const FoodProductCreatePage = lazy(() =>
  import("src/pages/dashboard/FoodProduct/new")
);
const FoodProductEditPage = lazy(() =>
  import("src/pages/dashboard/FoodProduct/edit")
);
// PRODUCT

const MarketProductDetailsPage = lazy(() =>
  import("src/pages/dashboard/MarketProduct/details")
);
const MarketProductListPage = lazy(() =>
  import("src/pages/dashboard/MarketProduct/list")
);
const MarketProductCreatePage = lazy(() =>
  import("src/pages/dashboard/MarketProduct/new")
);
const MarketProductEditPage = lazy(() =>
  import("src/pages/dashboard/MarketProduct/edit")
);

// BUssnies

const BusinessDetailsPage = lazy(() =>
  import("src/pages/dashboard/Business/details")
);
const BusinessListPage = lazy(() =>
  import("src/pages/dashboard/Business/list")
);
const BusinessCreatePage = lazy(() =>
  import("src/pages/dashboard/Business/new")
);
const BusinessEditPage = lazy(() =>
  import("src/pages/dashboard/Business/edit")
);

// ORDER
const OrderListPage = lazy(() => import("src/pages/dashboard/order/list"));
const OrderMarketListPage = lazy(() => import("src/pages/dashboard/order_Market/list"));
const OrderMarketDetailsPage = lazy(() =>
  import("src/pages/dashboard/order_Market/details")
);
const OrderDetailsPage = lazy(() =>
  import("src/pages/dashboard/order/details")
);
const OrderDeliveryListPage = lazy(() => import("src/pages/dashboard/order_Delivery/list"));
const OrderDeliveryDetailsPage = lazy(() =>
  import("src/pages/dashboard/order_Delivery/details")
);

// Delivery
const DeliveryListPage = lazy(() =>
  import("src/pages/dashboard/delivery/list")
);

// INVOICE
const InvoiceListPage = lazy(() => import("src/pages/dashboard/invoice/list"));
const InvoiceMarketListPage = lazy(() => import("src/pages/dashboard/invoice_Market/list"));
const InvoiceDeliveryListPage = lazy(() => import("src/pages/dashboard/invoice_Delivery/list"));
const InvoiceDeliveryDetailsPage = lazy(() =>
  import("src/pages/dashboard/invoice_Delivery/details")
);
const InvoiceDetailsPage = lazy(() =>
  import("src/pages/dashboard/invoice/details")
);
const InvoiceMarketDetailsPage = lazy(() => import("src/pages/dashboard/invoice_Market/details"));
const InvoiceEditPage = lazy(() => import("src/pages/dashboard/invoice/edit"));
// USER
const UserProfilePage = lazy(() => import("src/pages/dashboard/user/profile"));
const UserCardsPage = lazy(() => import("src/pages/dashboard/user/cards"));
const UserListPage = lazy(() => import("src/pages/dashboard/user/list"));
const UserAccountPage = lazy(() => import("src/pages/dashboard/user/account"));
const UserCreatePage = lazy(() => import("src/pages/dashboard/user/new"));
const UserEditPage = lazy(() => import("src/pages/dashboard/user/edit"));
// BLOG
const Contact = lazy(() => import("src/pages/dashboard/Contact/contact"));

// JOB
const ChatPage = lazy(() => import("src/pages/dashboard/chat/chat"));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { path: 'app', element: <IndexPage />, index: true },
      {
        path: "user",
        children: [
          { element: <UserProfilePage />, index: true },
          { path: "profile", element: <UserProfilePage /> },
          { path: "cards", element: <UserCardsPage /> },
          { path: "list", element: <UserListPage /> },
          { path: "new", element: <UserCreatePage /> },
          { path: ":id/edit", element: <UserEditPage /> },
          { path: "account", element: <UserAccountPage /> },
        ],
      },
      {
        path: "Food_product",
        children: [
          { element: <FoodProductListPage />, index: true },
          // { path: 'list', element: <ProductListPage /> },
          { path: ":id", element: <FoodProductDetailsPage /> },
          { path: "new", element: <FoodProductCreatePage /> },
          { path: ":id/edit", element: <FoodProductEditPage /> },
        ],
      },
      {
        path: "Market_product",
        children: [
          { element: <MarketProductListPage />, index: true },
          // { path: 'list', element: <ProductListPage /> },
          { path: ":id", element: <MarketProductDetailsPage /> },
          { path: "new", element: <MarketProductCreatePage /> },
          { path: ":id/edit", element: <MarketProductEditPage /> },
        ],
      },
      {
        path: "Stores",
        children: [
          { element: <BusinessListPage />, index: true },
          // { path: 'list', element: <BusinessListPage /> },
          { path: ":id", element: <BusinessDetailsPage /> },
          { path: "new", element: <BusinessCreatePage /> },
          { path: ":id/edit", element: <BusinessEditPage /> },
        ],
      },
      {
        path: "Foodorder",
        children: [
          { element: <OrderListPage />, index: true },
          { path: "list", element: <OrderListPage /> },
          { path: ":id", element: <OrderDetailsPage /> },
        ],
      },
      {
        path: "Marketorder",
        children: [
          { element: <OrderMarketListPage />, index: true },
          { path: "list", element: <OrderMarketListPage /> },
          { path: ":id", element: <OrderMarketDetailsPage /> },
        ],
      },
      {
        path: "orderDelivery",
        children: [
          { element: <OrderDeliveryListPage />, index: true },
          { path: "list", element: <OrderDeliveryListPage /> },
          { path: ":id", element: <OrderDeliveryDetailsPage /> },
        ],
      },
      // {
      //   path: "delivery",
      //   children: [
      //     { element: <DeliveryListPage />, index: true },
      //     { path: "list", element: <DeliveryListPage /> },
      //     // { path: ':id', element: <OrderDetailsPage /> },
      //   ],
      // },
      {
        path: "Marketinvoice",
        children: [
          { element: <InvoiceMarketListPage />, index: true },
          { path: "list", element: <InvoiceMarketListPage /> },
          { path: ":id", element: <InvoiceMarketDetailsPage /> },
          // { path: ":id/edit", element: <InvoiceEditPage /> },
          // { path: "new", element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: "Foodinvoice",
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <InvoiceDetailsPage /> },
          // { path: ":id/edit", element: <InvoiceEditPage /> },
          // { path: "new", element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: "invoiceDelivery",
        children: [
          { element: <InvoiceDeliveryListPage />, index: true },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <InvoiceDeliveryDetailsPage /> },
          // { path: ":id/edit", element: <InvoiceEditPage /> },
          // { path: "new", element: <InvoiceCreatePage /> },
        ],
      },

      
      { path: 'contact', element: <Contact/> },

      { path: 'chat', element: <ChatPage /> },
      
    ],
  },
];
