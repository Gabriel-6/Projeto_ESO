import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Inventory from '../pages/Inventory';
import Users from '../pages/Users';

const Router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/inventory/:id', element: <Inventory /> },
    { path: '/users', element: <Users /> },
    { path: '*', element: <PageNotFound /> }
]);

export default Router;