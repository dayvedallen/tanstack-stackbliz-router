import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
  useSearch,
  parseSearchWith,
  stringifySearchWith,
} from '@tanstack/router';
import jsurl from 'jsurl2';

const rootRoute = new RootRoute({
  component: () => (
    <>
      <div>
        <Link to="/">Home</Link>{' '}
        <Link
          to="/about"
          search={{ foo: 'SOME_STRING_THAT_SHOULD_NOT_BE_PARSED' }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div>
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    const search = useSearch();
    return (
      <div>
        <div>Hello from About!</div>
        <pre>{JSON.stringify(search, null, 2)}</pre>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

const router = new Router({
  routeTree,
  parseSearch: parseSearchWith(jsurl.parse),
  stringifySearch: stringifySearchWith(jsurl.stringify),
});

declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
