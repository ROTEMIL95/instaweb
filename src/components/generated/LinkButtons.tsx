interface LinkButtonsProps {
  externalUrl: string | null;
  username: string;
}

export default function LinkButtons({
  externalUrl,
  username,
}: LinkButtonsProps) {
  return (
    <div className="p-5 bg-gray-50 space-y-2.5">
      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          {new URL(externalUrl).hostname.replace("www.", "")}
        </a>
      )}
      <a
        href={`https://instagram.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        Follow on Instagram
      </a>
    </div>
  );
}
