import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Scrollbar from 'src/components/scrollbar';
import ChatMessageItem from './chat-message-item';
import { useGetConversation } from 'src/api/chat';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function ChatMessageList({messages}) {



  return (
    <>
      <Scrollbar sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages?.map((message) => (
            <ChatMessageItem key={message?.id} message={message} />
          ))}
        </Box>
      </Scrollbar>
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
};
