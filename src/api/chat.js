import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';
// utils
import axios, { endpoints, fetcher } from 'src/utils/axios';
import { useMockedUser } from 'src/hooks/use-mocked-user';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetContacts() {
  const URL = [endpoints.chat];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      contacts: data?.chats || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const byId = keyBy(data?.conversations, 'id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId,department,item,message ) {
  const URL = conversationId?
  `${endpoints.message}/${conversationId}/${item}/${department}`:null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  

  const memoizedValue = useMemo(
    () => ({
      conversation: data,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId, messageData) {
  const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const CONVERSATION_URL = [
    endpoints.chat,
    {
      params: { conversationId, endpoint: 'conversation' },
    },
  ];

  /**
   * Work on server
   */
  // const data = { conversationId, messageData };
  // await axios.put(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    CONVERSATION_URL,
    (currentData) => {
      const { conversation: currentConversation } = currentData;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return {
        conversation,
      };
    },
    false
  );

  /**
   * Work in local
   */
  mutate(
    CONVERSATIONS_URL,
    (currentData) => {
      const { conversations: currentConversations } = currentData;

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, messageData],
            }
          : conversation
      );

      return {
        conversations,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const conversations = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(user,conversationId) {

  const URL = `${endpoints.message}/${conversationId}/${user}/5`;

  /**
   * Work on server
   */
  const res = await axios.get(URL);

  /**
   * Work in local
   */
  // mutate(
  //   [
  //     URL,
    
  //   ],
  //   (currentData) => {
  //     console.log(currentData);
  //     // const conversations = currentData.conversations.map((conversation) =>
  //     //   conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
  //     // );

  //     return {
  //       ...currentData,
  //       // conversations,
  //     };
  //   },
  //   false
  // );
}
