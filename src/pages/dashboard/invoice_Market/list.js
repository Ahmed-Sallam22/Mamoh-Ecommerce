import { Helmet } from 'react-helmet-async';
// sections
import { InvoiceListView } from 'src/sections/Market_invoice/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Invoice Market List</title>
      </Helmet>

      <InvoiceListView />
    </>
  );
}
