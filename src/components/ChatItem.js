import React from 'react';
import ChatMe from './ChatMe';
import ChatOther from './ChatOther';

export default function ChatItem({isMe, text, date}) {
  if (isMe) {
    return <ChatMe text={text} date={date} />;
  }
  return <ChatOther text={text} date={date} />;
}
