export default function NetworkErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">No Connection</h1>
      <p className="text-gray-600 mb-6">
        We couldn’t connect to the server. Please check your internet or try
        again.
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}
