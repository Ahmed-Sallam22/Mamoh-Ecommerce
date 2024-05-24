import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView } from 'src/sections/overview/app/view';
import { ContactForm } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function ContactViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Contact_us</title>
      </Helmet>

      <ContactForm />
    </>
  );
}
