import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden card-shadow border border-warm-100
        ${hoverable ? 'hover:shadow-lg hover:border-warm-200 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CardImage = ({ src, alt, className = '' }: CardImageProps) => {
  return (
    <div className={`w-full aspect-square overflow-hidden bg-warm-100 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={`p-4 md:p-5 ${className}`}>{children}</div>;
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return <div className={`p-5 border-b border-warm-100 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return <div className={`p-5 border-t border-warm-100 bg-warm-50 ${className}`}>{children}</div>;
};

Card.Image = CardImage;
Card.Content = CardContent;
Card.Header = CardHeader;
Card.Footer = CardFooter;

export default Card;
