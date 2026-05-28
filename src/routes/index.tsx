import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardView } from '../features/dashboard';
import { ProductsView, SkinView } from '../features/products';
import { StatusView } from '../features/status';
import { UsersView } from '../features/users';
import { AccountView } from '../features/account';
import { ProtectedRoute, LoginView } from '../features/auth';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardView />,
      },
      {
        path: 'products',
        element: <ProductsView />,
      },
      {
        path: 'products/skin',
        element: <SkinView />,
      },
      {
        path: 'status',
        element: <StatusView />,
      },
      {
        path: 'users',
        element: <UsersView />,
      },
      {
        path: 'account',
        element: <AccountView />,
      },
    ],
  },
]);
