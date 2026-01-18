export default function ChatMessage({ role, content }) {
  return (
    <div className={`message ${role === 'user' ? 'message-user' : 'message-assistant'}`}>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
}
