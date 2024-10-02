import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div style={{ textAlign: 'center', margin: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>
                Go back to Home
            </Link>
        </div>
    );
};

export default Error;
