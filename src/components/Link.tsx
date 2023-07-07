import useRouter from "../hooks/useRouter";

type LinkProps = { to: string; replace?: boolean; children: React.ReactNode };

export default function Link({ to, replace: isReplace, children }: LinkProps) {
  const { push, replace } = useRouter();

  function handleClickAnchor(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    if (isReplace) replace(to);
    else push(to);
  }

  return (
    <a href={to} onClick={handleClickAnchor}>
      {children}
    </a>
  );
}
