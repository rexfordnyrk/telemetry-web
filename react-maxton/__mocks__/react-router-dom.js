const React = require('react');

const mockNavigate = jest.fn();

const Link = ({ to, children, ...props }) =>
  React.createElement('a', { href: to, ...props }, children);

const NavLink = ({ to, children, className, ...props }) =>
  React.createElement('a', { href: to, className, ...props }, children);

const Navigate = ({ to, replace, state }) => {
  mockNavigate(to, { replace: !!replace, state });
  return React.createElement('div', {
    'data-testid': 'router-navigate',
    'data-to': to,
    'data-replace': String(!!replace),
  });
};

const useNavigate = () => mockNavigate;

const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
});

const useSearchParams = () => [new URLSearchParams('token=test-token'), jest.fn()];

const MemoryRouter = ({ children }) =>
  React.createElement(React.Fragment, null, children);

const BrowserRouter = MemoryRouter;

const Routes = ({ children }) =>
  React.createElement(React.Fragment, null, children);

const Route = () => null;

module.exports = {
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
  MemoryRouter,
  BrowserRouter,
  Routes,
  Route,
  useParams: () => ({}),
  mockNavigate,
};
