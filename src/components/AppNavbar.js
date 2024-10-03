import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Link, NavLink} from "react-router-dom"; // <---
import {useState, useContext} from "react";
import UserContext from "../context/UserContext";

export default function AppNavbar(){

	// AppNavbar retrieves the token from the localStorage and saves it to the user state
	// const [user, setUser] = useState(localStorage.getItem("token"));

	const {user, setUser } = useContext(UserContext);

	console.log(user);

	return (
		<Navbar expand="lg" className="bg-light">
		  <Container className="ms-0">
		    <Navbar.Brand href="/">Aling Kath</Navbar.Brand>
		    <Navbar.Toggle aria-controls="basic-navbar-nav" />
		    <Navbar.Collapse id="basic-navbar-nav">
		      <Nav className="me-auto">

		        <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
		        <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>

		       
		        
		        {(user.id !== null) ? 
					(user.isAdmin == true) 
						?
						<>
							<Nav.Link as={Link} to="/logout">Logout</Nav.Link>
						</>
						:
						<>
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
		  </Container>
		</Navbar>
	)
}