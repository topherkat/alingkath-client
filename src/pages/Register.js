import { useState, useEffect, useContext } from 'react';  
import { Form, Button, Container } from 'react-bootstrap';
import UserContext from '../context/UserContext'; 
import { Navigate } from 'react-router-dom'; 
import { Notyf } from 'notyf'; 
import 'notyf/notyf.min.css'; 

export default function Register() {
	const notyf = new Notyf();
	const { user } = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [contactNumber, setContactNumber] = useState(""); // changed from number to string
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [facebookLink, setFacebookLink] = useState(""); // New state for Facebook link
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		// Update isActive based on input validity
		setIsActive(firstName && lastName && email && contactNumber && password && confirmPassword && password === confirmPassword);
	}, [firstName, lastName, email, contactNumber, password, confirmPassword]);

	function registerUser(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstname: firstName,  // changed to match schema
				lastname: lastName,    // changed to match schema
				email: email,
				contactNumber: contactNumber, // changed to match schema
				password: password,
				facebookLink: facebookLink // Include Facebook link in the request
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "User registered successfully") {
				notyf.success("Registration successfully");
				setFirstName("");
				setLastName("");
				setEmail("");
				setContactNumber("");
				setPassword("");
				setConfirmPassword("");
				setFacebookLink(""); // Reset Facebook link field
			} else {
				notyf.error(data.message || "Something went wrong");
			}
		})
		.catch(err => {
			console.error(err);
			notyf.error("An error occurred while registering");
		});
	}

	return (
		(user.id !== null) ? 
		<Navigate to="/courses" />
		:
		<Container className="col-12 col-md-4 mb-5 pb-5" style={{ minHeight: '100vh' }}>

		<Form onSubmit={registerUser}>
			<h1 className="mt-5 text-center">Register</h1> 
			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control type="text" 
					placeholder="Enter First Name" 
					required 
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control type="text" 
					placeholder="Enter Last Name" 
					required 
					value={lastName}
					onChange={e => setLastName(e.target.value)}
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control type="email" 
					placeholder="Enter Email" 
					required 
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Contact No.:</Form.Label>
				<Form.Control type="text"  // changed to text for flexibility
					placeholder="Enter Contact Number" 
					required 
					value={contactNumber}
					onChange={e => setContactNumber(e.target.value)}
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Facebook Profile Link: </Form.Label>
				<Form.Control type="text" // URL type for validation
					placeholder="Enter Facebook Link" 
					value={facebookLink}
					onChange={e => setFacebookLink(e.target.value)}

				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Password: </Form.Label>
				<Form.Control type="password" 
					placeholder="Enter Password" 
					required 
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control type="password" 
					placeholder="Confirm Password" 
					required 
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
				/>
			</Form.Group>

			<Button className="mt-3" variant={isActive ? "primary" : "danger"} type="submit" disabled={!isActive}>
				Submit
			</Button>
		</Form>
		</Container>
	);
}
