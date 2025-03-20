import { Message } from '../../schema/models';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div className={`mb-4 ${isCurrentUser ? 'text-right' : ''}`}>
      <div
        className={`p-3 rounded-lg max-w-md ${
          isCurrentUser
            ? 'bg-blue-500 text-white ml-auto'
            : 'bg-gray-300'
        }`}
      >
        {message.user_name && (
          <p className="text-xs font-semibold mb-1">
            {message.user_name}
          </p>
        )}
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
            {/* {message.created_at} */}
          {new Date((message.created_at?.seconds ?? 0) * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
