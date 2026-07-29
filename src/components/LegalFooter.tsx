export function LegalFooter() {
  return (
    <footer className="border-t bg-white py-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-4 text-sm text-gray-600">
        <a href="https://credentialsai.com.au/privacy" className="font-medium text-gray-700 underline-offset-4 hover:underline">Privacy</a>
        <a href="https://credentialsai.com.au/terms" className="font-medium text-gray-700 underline-offset-4 hover:underline">Terms</a>
        <a href="https://credentialsai.com.au/refunds" className="font-medium text-gray-700 underline-offset-4 hover:underline">Refunds &amp; Cancellation</a>
        <a href="mailto:isaac@erosium.com.au" className="font-medium text-gray-700 underline-offset-4 hover:underline">Support</a>
      </div>
    </footer>
  );
}

export default LegalFooter;
