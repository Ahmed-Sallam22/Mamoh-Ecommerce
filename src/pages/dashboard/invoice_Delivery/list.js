import { Helmet } from 'react-helmet-async';
// sections
import { InvoiceListView } from 'src/sections/invoice_Delivery/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Invoice Delivery List</title>
      </Helmet>

      <InvoiceListView />
    </>
  );
}
