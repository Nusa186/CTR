export default function ApprovalSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-4">
          Request Approved Successfully
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for reviewing and approving this tree cutting request. The status has been updated in the system.
        </p>
        <p className="text-sm text-gray-500">
          You can now close this window.
        </p>
      </div>
    </div>
  );
}