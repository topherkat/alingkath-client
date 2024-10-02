import { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView'; // Assuming you have a UserView for non-admins
import AdminView from '../components/AdminView'; // Assuming you have an AdminView for admins
import {Container} from 'react-bootstrap';

export default function Products() {
    const { user } = useContext(UserContext); // Access user context
    const [products, setProducts] = useState([]); // State to store products

    // Function to fetch products based on user role
    const fetchData = () => {
        // Construct the fetch URL based on user role
        const fetchUrl = user.isAdmin
            ? `${process.env.REACT_APP_API_URL}/products/all`
            : `${process.env.REACT_APP_API_URL}/products`;

        // Fetch products from the server
        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data); // Update products state with fetched data
            })
            .catch(error => {
                console.error("Error fetching products:", error); // Handle errors
            });
    };

    // Fetch products on initial render and when user role changes
    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <>
        <Container>
            {user.isAdmin ? (
                <AdminView productsData={products} fetchData={fetchData} /> // Render AdminView for admins
            ) : (
                <UserView productsData={products} /> // Render UserView for regular users
            )}
            </Container>
        </>
    );
}
