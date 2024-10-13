import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';

import Container from 'react-bootstrap/Container';

import AppNavbar from './components/AppNavbar';


import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Register from "./pages/Register";

import Products  from "./pages/Products";
import AddProduct from "./components/AddProduct"; 


import Cart  from "./pages/Cart";
import Orders  from "./pages/Orders";
import OrderHistory  from "./pages/OrderHistory";

import Users  from "./pages/Users";


import Notes from "./pages/Notes";
import SubmitFeedback from "./pages/SubmitFeedback";
import ManageFeedbacks from "./pages/ManageFeedbacks";
import Error from "./pages/Error";


import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from "./context/UserContext"; 

import { Notyf } from 'notyf'; // imports the notyf module
import 'notyf/notyf.min.css'; // imports the style for notyf boxes


function App() {
   const notyf = new Notyf(); // <---
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
          facebookLink: data.facebookLink,
          isAdmin: data.isAdmin
        });
      } else {
        setUser({
          id: null,
          email: null,
          firstName: null,
          lastName: null,
          mobileNo: null,
          facebookLink: null,
          isAdmin: null
        });
      }
    })
    .catch(error => {
          if (error.toString().includes("TypeError: Failed to fetch") || error.toString().includes("WebSocket")) {
            notyf.error("Data not yet available. Please wait."); // Handle errors
        
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
          <Container fluid>
            <Routes>
             
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path = "/profile" element={ <Profile /> } />
              <Route path = "/logout" element={ <Logout /> } />
              <Route path="/register" element={<Register />} />

              <Route path = "/products" element={ <Products /> } />
              <Route path = "/add-product" element={ <AddProduct /> } />

              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/users" element={<Users />} />

              <Route path="/notes" element={<Notes />} />
              <Route path="/submit-feedback" element={<SubmitFeedback />} />
              <Route path="/manage-feedbacks" element={<ManageFeedbacks />} />


              <Route path="*" element={<Error />} />


            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;