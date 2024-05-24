import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView } from 'src/sections/overview/app/view';
import { ChatView } from 'src/sections/chat/view';


// ----------------------------------------------------------------------

export default function ChatViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: chat</title>
      </Helmet>

      <ChatView />
    </>
  );
}
