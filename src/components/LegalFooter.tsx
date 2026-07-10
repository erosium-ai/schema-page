/* 🔑 Keywords: SchemaPage legal footer, Credentials AI Privacy, Terms, Beastly Tech GC ABN */

import { SupportEmailLink } from "@/components/SupportEmailLink";

export function LegalFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center text-xs leading-6 text-gray-500">
      <p>SchemaPage is the AI Profile builder for Credentials AI.</p>
      <p>Operated by Beastly Tech GC Pty Ltd · ABN 52 699 330 553 · Trading as Erosium</p>
      <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Legal">
        <a href="https://credentialsai.com.au" className="font-medium text-gray-700 underline-offset-4 hover:underline">Credentials AI</a>
        <a href="https://credentialsai.com.au/privacy" className="font-medium text-gray-700 underline-offset-4 hover:underline">Privacy</a>
        <a href="https://credentialsai.com.au/terms" className="font-medium text-gray-700 underline-offset-4 hover:underline">Terms</a>
        <SupportEmailLink className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-700 underline-offset-4 hover:underline" />
      </nav>
    </footer>
  );
}
