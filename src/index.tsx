import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter} from 'react-router-dom';

import RootApp from './RootApp';
import SingleUserPage from './Components/SingleUserPage';
import Household from './Components/Household'

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootApp/>
  },
  {
    path: '/userInfo/:id',
    element: <SingleUserPage />
  },
  {
    path: '/:type',
    element: <Household />
  }
])
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(  
  <RouterProvider router={router} />
);

