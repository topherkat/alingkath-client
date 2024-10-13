import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 30; // Limit users per page to 30

    // Fetch all users when the component mounts
    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in local storage after login

            const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await res.json();
            setUsers(data);
            setFilteredUsers(data); // Initially, set filtered users as the full list
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterUsers(query);
    };

    // Filter users based on search query (by ID, first name, or last name)
    const filterUsers = (query) => {
        if (query) {
            const filtered = users.filter(
                (user) =>
                    user._id.toLowerCase().includes(query) ||
                    user.firstname.toLowerCase().includes(query) ||
                    user.lastname.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users); // Show all users when query is empty
        }
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Get the current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center mt-5">
                Error: {error}
            </Alert>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center">All Users</h2>

            {/* Search Bar */}
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by ID, First Name, or Last Name"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </InputGroup>

            {/* Users Table */}
            {currentUsers.length > 0 ? (
                <>
                    <Table striped bordered hover responsive className="mt-4">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Address</th>
                                <th>Facebook Link</th>
                                <th>Admin Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.contactNumber}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        {user.facebookLink ? (
                                            <a href={user.facebookLink} target="_blank" rel="noopener noreferrer">
                                                {user.facebookLink}
                                            </a>
                                        ) : 'N/A'}
                                    </td>
                                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <Pagination className="justify-content-center">
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={currentPage === index + 1}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </>
            ) : (
                <Alert variant="info" className="text-center mt-5">
                    No users found.
                </Alert>
            )}
        </div>
    );
}
