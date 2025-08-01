const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-3">
        <span className="w-5 h-5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
        <span className="w-5 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-5 h-5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
        <span className="w-5 h-5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
        <span className="w-5 h-5 bg-orange-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default Loader;