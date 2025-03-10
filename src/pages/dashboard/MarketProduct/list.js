import { Helmet } from 'react-helmet-async';
// sections
import { ProductListView } from 'src/sections/product copy/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
