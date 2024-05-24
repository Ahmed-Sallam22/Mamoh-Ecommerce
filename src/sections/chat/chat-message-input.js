import PropTypes from 'prop-types';
import { sub } from 'date-fns';
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter,useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import uuidv4 from 'src/utils/uuidv4';
// api
import { sendMessage, createConversation, useGetConversation } from 'src/api/chat';
// components
import Iconify from 'src/components/iconify';
import { io } from 'socket.io-client';
import { useAuthContext } from 'src/auth/hooks';
import { endpoints } from 'src/utils/axios';
import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  disabled,
  selectedConversationId,
  handleinfo,
  selecteddepartmentConversationId,
  selecteditem_idConversationId,
}) {
  const auth = useAuthContext();

  const router = useRouter();






  const { user } = useMockedUser();
console.log(user);
  const fileRef = useRef(null);

  const [message, setMessage] = useState('');
  const [messagess, setMessagess] = useState([]);

  const { conversation, conversationError } = useGetConversation(selectedConversationId, selecteddepartmentConversationId, selecteditem_idConversationId,message);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
 
  const [error, setError] = useState('');
  const [blockedUser, setBlockedUser] = useState(false); 

  useEffect(() => {
    
          const newSocket = io('http://195.238.122.7:30643', {
              auth: {
                  token:auth?.user?.accessToken
              }
          });
          setSocket(newSocket);

          newSocket?.on('connect', () => {
              console.log('Connected to server');
              newSocket.emit('add user', { client: user.id, conversation: selectedConversationId, department_id: selecteddepartmentConversationId, item_id: selecteditem_idConversationId });
          });
          newSocket?.on('message', (data) => {
              console.log('Received message data:', data);
              if (data && data.message) {
                setMessages(prevMessages => [...prevMessages, data]);
              } else {
                  console.error('Received invalid message data:', data);
              }
          });
          newSocket?.on('user_blocked', (blockedUserId) => {
              console.log(blockedUserId)
              if ((blockedUserId.blocked_user_id === selectedConversationId && blockedUserId.from_id===user.id)||
              ((blockedUserId.blocked_user_id === user.id && blockedUserId.from_id===selectedConversationId))
              ) {
                  console.log('blockeeed')
                  setBlockedUser(true);
              }
          });
          newSocket?.on('user_unblocked', (unblockedUserId) => {
              console.log(unblockedUserId)

              if ((unblockedUserId.blocked_user_id === selectedConversationId && unblockedUserId.from_id===user.id)||
              ((unblockedUserId.blocked_user_id === user.id && unblockedUserId.from_id===selectedConversationId))
              ) {
                  console.log('unblockeeed')
                  setBlockedUser(false);
              }
          });
          newSocket?.on('disconnect', () => {
              console.log('Disconnected from server');
          });
          setSocket(newSocket);
  }, [auth?.user?.accessToken,messagess,conversation]);

  const sendMessage = () => {

      if (socket && message.trim() !== '') {
          const messageData = {
              to_id: selectedConversationId,
              from_id: user.id,
              message: message,
              departments_id: selecteddepartmentConversationId,
              item_id: selecteditem_idConversationId
          };
          socket.emit('send_message', messageData);
          const calculateTimeAgo = (timestamp) => {
            const now = Date.now();
            const difference = now - timestamp;
        
            if (difference < 1000) {
                return 'just now';
            } else if (difference < 60 * 1000) {
                const seconds = Math.floor(difference / 1000);
                return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
            } else if (difference < 60 * 60 * 1000) {
                const minutes = Math.floor(difference / (60 * 1000));
                return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else if (difference < 24 * 60 * 60 * 1000) {
                const hours = Math.floor(difference / (60 * 60 * 1000));
                return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            } else if (difference < 30 * 24 * 60 * 60 * 1000) {
                const days = Math.floor(difference / (24 * 60 * 60 * 1000));
                return `${days} day${days !== 1 ? 's' : ''} ago`;
            } else if (difference < 12 * 30 * 24 * 60 * 60 * 1000) {
                const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));
                return `${months} month${months !== 1 ? 's' : ''} ago`;
            } else {
                const years = Math.floor(difference / (12 * 30 * 24 * 60 * 60 * 1000));
                return `${years} year${years !== 1 ? 's' : ''} ago`;
            }
        };
          const newMessage = {
            id: Math.floor(Math.random() * 1000000),
            message:message,
            time: calculateTimeAgo(Date.now()),
                         from : {
              id: user.id,
              image: user.photoURL,
              full_name: user.displayName
          }        }
        handleinfo(newMessage)
          setMessage('');
      } else {
          setError('Token is required to send a message.');
      }
  };

  const blockUser = () => {
      if (socket) {
          socket.emit('block_user', { from_id:user.id,blocked_user_id: selectedConversationId });
          setBlockedUser(true);
      }
  };

  const unblockUser = () => {
      if (socket) {
          socket.emit('unblock_user', { from_id:user.id,blocked_user_id: selectedConversationId });
          setBlockedUser(false);
      }
  };



  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  

  return (
    <>
      <InputBase
        value={message}
        // onKeyUp={handleSendMessage}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        // startAdornment={
        //   <IconButton>
        //     <Iconify icon="eva:smiling-face-fill" />
        //   </IconButton>
        // }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton> */}
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton> */}
          <IconButton onClick={()=>{
            sendMessage()
            // handleUpdateConversation()
          }
          }>
    <Iconify icon="mdi:send" />
  </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />

    </>
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onAddRecipients: PropTypes.func,
  recipients: PropTypes.array,
  selectedConversationId: PropTypes.string,
  selecteditem_idConversationId: PropTypes.string,
  selecteddepartmentConversationId: PropTypes.string,
};
