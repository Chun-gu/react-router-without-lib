import Root from "./pages/Root";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export type Routes = { path: string; component: JSX.Element }[];

const routes: Routes = [
  { path: "/", component: <Root /> },
  { path: "/about", component: <About /> },
  { path: "*", component: <NotFound /> },
];

export default routes;
