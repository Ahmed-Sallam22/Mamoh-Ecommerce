
/* eslint-disable no-undef */
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useGetNavItem } from './hooks';
import { useResponsive } from 'src/hooks/use-responsive';

import { clickConversation } from 'src/api/chat';
import { useMockedUser } from 'src/hooks/use-mocked-user';

export default function ChatNavItem({ selected, collapse,onCloseMobile, conversation,  contacts }) {
  const { user } = useMockedUser();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const {
    group,
    displayName,
    displayText,
    participants,
    lastActivity,
    hasOnlineInGroup,
  } = useGetNavItem({
    conversation,
    contacts,
  });

  const handleClickConversation = useCallback(async (conversationId,department,item_id) => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }
        await clickConversation(user?.id,conversationId);
        const url = `/dashboard/chat?id=${conversationId}&item_id=${item_id}&department=${department}`;
        window.open(url, '_blank');
          } catch (error) {
      console.error(error);
    }
  }, [conversation?.id, mdUp, onCloseMobile, router]);

  const renderGroup = (
    <Badge
      variant={hasOnlineInGroup ? 'online' : 'invisible'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {participants.slice(0, 2)?.map((participant) => (
          <Avatar key={participant.id} alt={contacts?.item_image} src={contacts?.item_image} />
        ))}
      </AvatarGroup>
    </Badge>
  );

  
  const renderSingle = (
    <>
        <Badge key={contacts.chat_with_id} variant="dot">

          <Avatar alt={contacts?.item_name} src={contacts?.item_image} sx={{ width: 48, height: 48 }} />
         

        </Badge>
    </>
  );
  
  
  

  return (
    <ListItemButton
      disableGutters
      onClick={()=>handleClickConversation(contacts.chat_with_id,contacts.departments_id,contacts.item_id)}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <Badge
        color="error"
        overlap="circular"
        badgeContent={collapse ? conversation?.unreadCount : 0}
      >
        {group ? renderGroup : renderSingle}
      </Badge>

      {!collapse && (
        <>
          <ListItemText
            sx={{ ml: 2 }}
            primary={contacts?.item_name}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={contacts?.message}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: conversation?.unreadCount ? 'subtitle2' : 'body2',
              color: conversation?.unreadCount ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {contacts?.sent_time}
            </Typography>

            {!!conversation?.unreadCount && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: 'info.main',
                  borderRadius: '50%',
                }}
              />
            )}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}

ChatNavItem.propTypes = {
  collapse: PropTypes.bool,
  conversation: PropTypes.object,
  onCloseMobile: PropTypes.func,
  selected: PropTypes.bool,
  contacts: PropTypes.array,
};
