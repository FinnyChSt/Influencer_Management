export interface ButtonProps {
  onClick?: () => void;
  type: "button" | "submit" | "reset";
  children: React.ReactNode;
  variant: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  className?: string;
}
function Button({
  onClick,
  type,
  children,
  variant,
  disabled = false,
  className,
}: ButtonProps) {
  switch (variant) {
    case "primary":
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`px-4 py-2 bg-[#EBFF08] text-black font-medium cursor-pointer rounded-md hover:bg-[#D1E500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bbc800] ${className}`}
        >
          {children}
        </button>
      );
    case "secondary":
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`px-4 py-2 bg-neutral-200 text-neutral-800 cursor-pointer font-medium rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 mr-2 ${className}`}
        >
          {children}
        </button>
      );

    case "tertiary":
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`py-1 bg-transparent border border-neutral-400 text-neutral-300 font-medium rounded-md cursor-pointer hover:bg-neutral-700 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {children}
        </button>
      );
  }
}

export default Button;
