import Link from "../components/Link";

export default function Root() {
  return (
    <main>
      <h1>root</h1>
      <Link to="about">go about</Link>
      <Link to="about" replace={true}>
        replace to about
      </Link>
    </main>
  );
}
