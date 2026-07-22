interface AvatarProps {
  email?: string | null;
  size?: number;
}

export function Avatar({ email, size = 38 }: AvatarProps) {
  const initials = (email ?? '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?';
  return (
    <span
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-semibold text-cream"
      title={email ?? undefined}
    >
      {initials}
    </span>
  );
}
