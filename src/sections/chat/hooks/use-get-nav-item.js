export default function useGetNavItem({ currentUserId, conversation, contacts }) {
  if (!conversation || !conversation.messages || !conversation.participants || !contacts) {
    return {
      group: false,
      displayName: '',
      displayText: '',
      participants: [],
      lastActivity: '',
      hasOnlineInGroup: false,
    };
  }

  const { messages, participants } = conversation;

  const participantsInConversation = participants.filter(
    (participant) => participant.id !== currentUserId
  );

  const lastMessage = messages[messages.length - 1];

  const group = participantsInConversation.length > 1;

  const displayName = participantsInConversation.map((participant) => participant.name).join(', ');

  const hasOnlineInGroup = group
    ? participantsInConversation.map((item) => item.status).includes('online')
    : false;

  let displayText = '';

  if (lastMessage) {
    const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';

    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

    displayText = `${sender}${message}`;
  }

  return {
    group,
    displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage.createdAt,
    hasOnlineInGroup,
    contacts,
  };
}
