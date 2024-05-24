import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { InvoiceDetailsView } from 'src/sections/invoice_Delivery/view';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Invoice Delivery Details</title>
      </Helmet>

      <InvoiceDetailsView id={`${id}`} />
    </>
  );
}
