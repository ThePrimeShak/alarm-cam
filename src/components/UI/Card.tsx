import { twMerge } from "tailwind-merge";

type CardProps = {
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ className, ariaLabel, children }) => {
  const cardClass = twMerge(
    "rounded-lg border border-white/10 bg-card/80 px-4 py-4",
    className
  );

  return (
    <div className={cardClass} aria-label={ariaLabel}>
      {children}
    </div>
  );
};

Card.displayName = "Card";

export default Card;
