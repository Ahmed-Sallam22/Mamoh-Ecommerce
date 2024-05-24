import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { OrderDetailsView } from 'src/sections/order_Delivery/view';

// ----------------------------------------------------------------------

export default function OrderDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Order Delivery Details</title>
      </Helmet>

      <OrderDetailsView id={`${id}`} />
    </>
  );
}
