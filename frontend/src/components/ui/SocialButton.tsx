// src/components/ui/SocialButton.tsx
import { IconType } from 'react-icons';
import clsx from 'clsx';

type Props = {
  icon: IconType;
  label: string;
  provider: 'google' | 'github';
};

export default function SocialButton({ icon: Icon, label, provider }: Props) {
  return (
    <a
      href={`/api/oauth/${provider}`}           /* El backend redirige al proveedor */
      className={clsx(
        'btn flex w-full items-center justify-center gap-2',
        provider === 'google' && 'bg-white text-gray-700 shadow border hover:bg-gray-50',
        provider === 'github' && 'bg-gray-900 text-white hover:bg-gray-800'
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
}
