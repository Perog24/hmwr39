import React from 'react';
import ReactDOM from 'react-dom/client';

import RootApp from './RootApp';
import SingleUserPage from './Components/SingleUserPage';

import { RouterProvider, createBrowserRouter} from 'react-router-dom';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootApp/>
  },
  {
    path: '/userInfo/:id',
    element: <SingleUserPage />
  }
])
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(  
  <RouterProvider router={router} />
);

