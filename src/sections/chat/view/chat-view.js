import { useEffect, useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// api
import { useGetContacts, useGetConversation, useGetConversations } from 'src/api/chat';
// components
import { useSettingsContext } from 'src/components/settings';
//
import ChatNav from '../chat-nav';
import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';

// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';
  const selecteddepartmentConversationId = searchParams.get('department') || '';
  const selecteditem_idConversationId = searchParams.get('item_id') || '';


  const [recipients, setRecipients] = useState([]);

  const { contacts } = useGetContacts();

  const { conversations, conversationsLoading } = useGetConversations();


  const { conversation, conversationError } = useGetConversation(selectedConversationId,selecteddepartmentConversationId,selecteditem_idConversationId);
  // const participants = conversation
  //   ? conversation.participants?.filter((participant) => participant.id !== `${user.id}`)
  //   : [];
  const [info, setinfo] = useState([]);
  const handleinfo = (messagesodconversation) => {
    setinfo(prevMessages => [...prevMessages, messagesodconversation]);
  };
  const [All, setAllConversations] = useState([]);
  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.chat);
    }
    if(conversation){
      const updatedChatMessages = [...conversation?.chat_messages,...info];
      setAllConversations(updatedChatMessages)
      console.log(updatedChatMessages);
    }
  }, [conversation,conversations,conversationError, router, selectedConversationId,info]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  const details = !!conversation;

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
    >
      {selectedConversationId ? (
        <>{details && <ChatHeaderDetail participants={conversation} />}</>
      ) : (
        <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
      )}
    </Stack>
  );

  const renderNav = (
    <ChatNav
      contacts={contacts}
      conversations={conversations}
      loading={conversationsLoading}
      selectedConversationId={selectedConversationId}
    />
  );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <ChatMessageList messages={All} participants={conversation} />

      <ChatMessageInput
        recipients={recipients}
        onAddRecipients={handleAddRecipients}
        handleinfo={handleinfo}
        selectedConversationId={selectedConversationId}
        selecteditem_idConversationId={selecteditem_idConversationId}
        selecteddepartmentConversationId={selecteddepartmentConversationId}
        disabled={!recipients.length && !selectedConversationId}
      />
    </Stack>
  );







  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Chat
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        {renderNav}

        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          {renderHead}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {renderMessages}

            {/* {details && <ChatRoom conversation={conversation} participants={conversation} />} */}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
