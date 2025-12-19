import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

function ChatContainer() {
  const { messages, getMessages, isMessageLoading, selectedUser,subscribeToMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null)


  useEffect(() => {
    if (!selectedUser) return; 
    getMessages(selectedUser._id);

     subscribeToMessages()

    
   

  }, [getMessages, selectedUser?._id]); 
  useEffect(() => {
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"})
      }
  }, [messages])
  
  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 flex flex-col overflow-auto'>
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png" 
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleString("en-US",{dateStyle:"short",timeStyle:"short"})} {/* ✅ Formats the timestamp */}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
