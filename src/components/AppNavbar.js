import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Link, NavLink} from "react-router-dom"; // <---
import {useState, useContext} from "react";
import UserContext from "../context/UserContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function AppNavbar(){

	// AppNavbar retrieves the token from the localStorage and saves it to the user state
	// const [user, setUser] = useState(localStorage.getItem("token"));

	const {user, setUser } = useContext(UserContext);

	console.log(user);

	return (
		<Navbar expand="lg" variant="dark" className="bg-dark p-0">
		  
		  	
		    <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto"/>
		    <Navbar.Collapse id="basic-navbar-nav" className="m-0 m-auto">
		      <Nav className="d-flex align-items-center justify-content-center w-100 m-auto">

		      	
		      	<Navbar.Brand href="/" className="m-0">Aling Kath</Navbar.Brand>
		        <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
		        <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
	
	       
		        
		        {(user.id != null || user.id != undefined) ? 
					(user.isAdmin == true) 
						?
						<>	
							<Nav.Link as={Link} to="/order-history">Orders</Nav.Link>
							<Nav.Link as={Link} to="/logout">Logout</Nav.Link>
						</>
						:
						<>	
							
							<Nav.Link as={Link} to="/cart" className="mt-2">
								<FontAwesomeIcon icon={faCartShopping} className="h3"/>
							</Nav.Link>
							<Nav.Link as={NavLink} to="/orders" exact="true">Orders</Nav.Link>
							<Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>

						</>
					:
					<>
					    <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
					    <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
					</>
				}

		      </Nav>
		    </Navbar.Collapse>
		
		</Navbar>
	)
}