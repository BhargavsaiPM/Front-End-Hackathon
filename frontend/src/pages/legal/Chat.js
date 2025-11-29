import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import '../user/UserPages.css';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('request');
  const [conversations, setConversations] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (requestId) {
      const request = conversations.find(c => c.help_request_id === parseInt(requestId));
      if (request) {
        setSelectedRequest(request);
        fetchMessages(request.help_request_id);
      }
    } else if (conversations.length > 0) {
      setSelectedRequest(conversations[0]);
      fetchMessages(conversations[0].help_request_id);
    }
  }, [requestId, conversations]);

  useEffect(() => {
    scrollToBottom();
    if (selectedRequest) {
      const interval = setInterval(() => {
        fetchMessages(selectedRequest.help_request_id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRequest]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (reqId) => {
    try {
      const response = await api.get(`/api/messages/help-request/${reqId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRequest) return;

    try {
      await api.post('/api/messages', {
        help_request_id: selectedRequest.help_request_id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedRequest.help_request_id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (conversations.length === 0) {
    return (
      <div className="chat-container">
        <div className="empty-state">
          <p>You don't have any assigned requests yet.</p>
          <p>Assign yourself to a request to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Your Conversations</h3>
        {conversations.map(conv => (
          <div
            key={conv.help_request_id}
            className={`conversation-item ${selectedRequest?.help_request_id === conv.help_request_id ? 'active' : ''}`}
            onClick={() => {
              setSelectedRequest(conv);
              fetchMessages(conv.help_request_id);
            }}
          >
            <p className="conv-type">User: {conv.pseudonym || conv.anonymous_id}</p>
            <p className="conv-status">Status: {conv.status}</p>
            {conv.message_count > 0 && (
              <span className="message-count">{conv.message_count} messages</span>
            )}
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedRequest && (
          <>
            <div className="chat-header">
              <h3>Conversation with {selectedRequest.pseudonym || selectedRequest.anonymous_id}</h3>
              <p>Status: {selectedRequest.status}</p>
            </div>

            <div className="messages-container">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender_role === 'legal' ? 'message-sent' : 'message-received'}`}
                >
                  <div className="message-header">
                    <strong>{msg.pseudonym || msg.anonymous_id}</strong>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" className="btn-send">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;

