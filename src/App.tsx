import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState } from 'react';

import NavBar from './components/NavBar';
import LoginComponent from './components/LoginComponent';
import CreateSpace from './components/spaces/CreateSpace';
import Spaces from './components/spaces/Spaces';
import { AuthService } from './services/AuthService';
import { DataService } from './services/DataService';
import './App.css';

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userName={userName}/>
          <Outlet />
        </>
      ),
      children:[
        {
          path: "/",
          element: <div>Hello world!</div>,
        },
        {
          path: "/login",
          element: <LoginComponent authService={authService} setUserNameCb={setUserName}/>,
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/createSpace",
          element: <CreateSpace dataService={dataService} />,
        },
        {
          path: "/spaces",
          element: <Spaces dataService={dataService} />,
        },
      ]
    },
  ]);
  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App;