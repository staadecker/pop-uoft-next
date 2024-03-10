const MessagePage = ({ msg, error }: { msg: string; error?: boolean }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className={`text-5xl font-bold ${error ? "text-red-800" : ""}`}>
        {msg}
      </p>
    </div>
  );
};

MessagePage.defaultProps = { error: false };

export default MessagePage;
