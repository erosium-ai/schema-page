"use client";

const EMAIL = "isaac@erosium.com.au";

interface SupportEmailLinkProps {
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

export function SupportEmailLink({
  label = "Email support",
  className = "",
  fullWidth = false,
}: SupportEmailLinkProps) {
  const handleClick = () => {
    void navigator.clipboard?.writeText(EMAIL).catch(() => undefined);
    window.location.href = `mailto:${EMAIL}?subject=Credentials%20AI%20support`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${fullWidth ? "w-full " : ""}${className}`}
      title={`Copy ${EMAIL} and open email`}
    >
      {label}
    </button>
  );
}
