import { Helmet } from 'react-helmet-async';
// sections
import { OrderListView } from 'src/sections/Market_order/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order Market List</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
