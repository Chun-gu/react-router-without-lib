export default function useRouter() {
  const popStateEvent = new PopStateEvent("popstate");

  function push(to: string) {
    window.history.pushState("", "", to);
    window.dispatchEvent(popStateEvent);
  }

  function replace(to: string) {
    window.history.replaceState("", "", to);
    window.dispatchEvent(popStateEvent);
  }

  return { push, replace };
}
