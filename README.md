# React와 History API 사용하여 SPA Router 기능 구현하기

## 요구사항

### 1) 해당 주소로 진입했을 때 아래 주소에 맞는 페이지가 렌더링 되어야 한다.

- `/` → `root` 페이지
- `/about` → `about` 페이지

### 2) 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동해야 한다.

### 3) Router, Route 컴포넌트를 구현해야 하며, 형태는 아래와 같아야 한다.

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

### 4) 최소한의 push 기능을 가진 useRouter Hook을 작성한다.

```tsx
const { push } = useRouter();
```

---

## 구현방식

### 1) 주소에 맞는 페이지 렌더링

요구사항에 따라 `Router`의 `children`으로 `Route`들을 받은 뒤 `Router` 내부에서 `Children API`를 사용해 `Route`를 순회하려 했지만
[React의 공식 문서에 따르면 Children은 Legacy API이다.](https://react.dev/reference/react/Children)  
그래서 공식문서에서 제시한 대안 중 하나인 [객체의 배열을 prop으로 받는 방식](https://react.dev/reference/react/Children#accepting-an-array-of-objects-as-a-prop)을 선택했다. react-router-dom 또한 v6가 되면서 [튜토리얼에서 이 방식을 사용한다.](https://reactrouter.com/en/main/start/tutorial#adding-a-router)

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router routes={routes} />
  </React.StrictMode>
);
```

### 2) 버튼 클릭과 뒤로 가기로 페이지 이동

[특별한 경우를 제외하고 페이지 이동은 일반적으로 `a`태그를 이용해야 하기 때문에](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#more_on_links) `a` 태그를 반환하는 `Link` 컴포넌트를 만들었다.  
클릭시 `e.preventDefault()`로 기본 동작을 막고, `useRouter` 훅의 `push`와 `replace`를 사용해 세션 히스토리 스택에 `to`를 push 하거나 replace 한다.

```tsx
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
```

### 3) Route, Router 컴포넌트

#### 3-1) Route

`Children API`를 사용하지 않았기 때문에 컴포넌트로 구현하지 않고 객체의 배열로 작성했다.  
`component`에 `string`, `null` 등을 넣을 수 없게 타입을 `JSX.Element`로 한정했다.

```tsx
export type Routes = { path: string; component: JSX.Element }[];

const routes: Routes = [
  { path: "/", component: <Root /> },
  { path: "/about", component: <About /> },
  { path: "*", component: <NotFound /> },
];
```

#### 3-2) Router

경로의 변경에 반응하기 위해 상태로 선언 및 할당했다.  
`useRouter`의 `push`, `replace` 또는 뒤로가기 버튼으로 `popstate` 이벤트가 발생하면 그에 반응하도록 window에 이벤트 리스너를 달아주었다.  
해당 이벤트가 발생하면 `setPath`로 `path`를 업데이트 해서 리렌더링을 트리거하고, `routes`의 객체 중 `path`가 현재 `path` 상태와 일치하는 객체를 찾아 그 `component`를 반환한다.  
일치하는 객체가 없다면 `*`에 해당하는 컴포넌트를 찾아 반환하도록 했다.

```tsx
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
```

### 4) useRouter hook

이동할 경로 `to`를 받아 히스토리 스택을 조작한다.  
`pushState`와 `replaceState`는 이벤트를 발생시키지 않기 때문에 직접 `dispatchEvent`를 해서  
window에 달아놓은 `popstate` 이벤트 리스너가 감지할 수 있도록 했다.

```ts
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
```

---

## 시연

<img src='./router-demo.gif'>
