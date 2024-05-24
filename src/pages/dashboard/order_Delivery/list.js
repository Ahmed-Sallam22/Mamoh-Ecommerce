import { Helmet } from 'react-helmet-async';
// sections
import { OrderListView } from 'src/sections/order_Delivery/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order Delivery</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
