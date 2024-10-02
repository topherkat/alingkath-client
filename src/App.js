import { useState, useEffect } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';

import AppNavbar from './components/AppNavbar';



import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products  from "./pages/Products";
import AddProduct from "./components/AddProduct"; 

import Error from "./pages/Error";


import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from "./context/UserContext"; 

function App() {
  const [user, setUser] = useState({
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    mobileNo: null,
    isAdmin: null
  });

  // unsetUser function, clears the values and keys saved in localStorage 
  function unsetUser() {
    localStorage.clear();
  }

  function retrieveUserDetails(token) {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, { // Use process.env.REACT_APP_API_URL
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("getProfile output:");
      console.log(data);

      if (data) {
        setUser({
          id: data._id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNo: data.mobileNo,
          isAdmin: data.isAdmin
        });
      } else {
        setUser({
          id: null,
          email: null,
          firstName: null,
          lastName: null,
          mobileNo: null,
          isAdmin: null
        });
      }
    });
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
    retrieveUserDetails(localStorage.getItem('token'));
  }, []);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
             

              <Route path="/login" element={<Login />} />
              <Route path = "/logout" element={ <Logout /> } />
              <Route path = "/products" element={ <Products /> } />
              <Route path = "/add-product" element={ <AddProduct /> } />
              <Route path="*" element={<Error />} />


            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
