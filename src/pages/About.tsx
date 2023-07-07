import Link from "../components/Link";

export default function About() {
  return (
    <main>
      <h1>about</h1>
      <Link to="/">go main</Link>
      <Link to="/" replace={true}>
        replace to main
      </Link>
    </main>
  );
}
