import { useEffect, useState } from "react";
import { type Routes } from "../routes";

type RouterProps = { routes: Routes };

export default function Router({ routes }: RouterProps) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const matchingRoute = routes.find((route) => route.path === path)?.component;
  const notFound = routes.find((route) => route.path === "*")?.component;

  return matchingRoute || notFound;
}
