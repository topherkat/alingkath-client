import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";
import {Navigate} from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf'; // imports the notyf module


export default function Login() {

    const notyf = new Notyf(); // <---

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);

    const {user, setUser } = useContext(UserContext); 


    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access){

                console.log(data.access);

                //set an item ("token") to the localStorage
                // saves the: "token" : the actual token to the localStorage
                                    // key    // value - the actual token
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                


                // Clear input fields after submission
                setEmail('');
                setPassword('');

                notyf.success(`You are now logged in`);
            
            } else if (data.message == "Incorrect email or password") {

                notyf.error(`Incorrect email or password`);

            } else {

                notyf.error(`${email} does not exist`);
            }

        })
        .catch(error =>{
            if (error.toString().includes("TypeError: Failed to fetch")) {
              notyf.error("Data not yet available. Please wait."); // Handle errors
            
            }
        })

    }

    // this function uses getProfile controller function of our server application to get the user details after logging in.
    function retrieveUserDetails(token){
        fetch(`${process.env.REACT_APP_API_URL}/users/details`,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(res=> res.json())
        .then(data => {
            console.log("getProfile output:");
            console.log(data);

            setUser({
                id: data._id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNo: data.mobileNo,
                isAdmin: data.isAdmin
            })
        })


    }

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
        (user.id !== null) ?
        <Navigate to="/products" />
        :
        <Form onSubmit={(e) => authenticate(e)} className="my-5">
            <h1 className="text-center">Login</h1>
            <Row className="justify-content-center">
                <Col md={6}> {/* Adjust the column size as needed */}
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control" // Add this class
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control" // Add this class
                        />
                    </Form.Group>

                    {isActive ? 
                        <Button variant="primary" type="submit" id="loginBtn">
                            Login
                        </Button>
                        : 
                        <Button variant="danger" type="submit" id="loginBtn" disabled>
                            Login
                        </Button>
                    }
                </Col>
            </Row>
        </Form>
    );
}