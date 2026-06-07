const React = require('react');

const Link = ({ to, children, ...props }) =>
  React.createElement('a', { href: to, ...props }, children);

const useSearchParams = () => [new URLSearchParams('token=test-token')];

const MemoryRouter = ({ children }) =>
  React.createElement(React.Fragment, null, children);

const Routes = ({ children }) =>
  React.createElement(React.Fragment, null, children);

const Route = () => null;

module.exports = {
  Link,
  useSearchParams,
  MemoryRouter,
  Routes,
  Route,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  BrowserRouter: MemoryRouter,
};
