import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={`animate-spin text-primary-500 ${sizes[size]} ${className}`}
      />
    </div>
  );
};

export default Spinner;
