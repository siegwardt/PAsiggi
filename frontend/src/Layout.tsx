import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
  <>
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/produkts">Produkte</Link>
          </li>
        </ul>
      </nav>
    </header>
    <Outlet />
  </>
  )
}

export default Layout;