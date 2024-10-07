import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";
import { Container, Table, Button, Form, Pagination } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function OrderHistory() {
  const { user } = useContext(UserContext); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [visibleOrders, setVisibleOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [sortOrder, setSortOrder] = useState('pendingFirst'); // Track sorting order
  const ordersPerPage = 10; 

  const toggleUserInfo = (orderId, userId) => {
    setVisibleOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));

    if (!visibleOrders[orderId]) {
      getUserDetails(userId, orderId);
    }
  };

  const getUserDetails = (userId, orderId) => {
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo((prevState) => ({
          ...prevState,
          [orderId]: data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/orders/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setOrders(data);
          setFilteredOrders(data);
        } else {
          Swal.fire('No orders found', '', 'info');
        }
        setLoading(false);
      })
      .catch((err) => {
        Swal.fire('Error', 'Failed to fetch orders', 'error');
        setLoading(false);
      });
  }, []);

  // Filter and sort orders based on search query and sort order
  useEffect(() => {
    let filtered = orders.filter(order =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.userId).toLowerCase().includes(searchQuery.toLowerCase()) // Ensure userId is treated as a string
    );

    if (sortOrder === 'pendingFirst') {
      filtered = filtered.sort((a, b) => (a.status === "Pending" ? -1 : 1));
    } else {
      filtered = filtered.sort((a, b) => (a.status === "Completed" ? -1 : 1));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, orders, sortOrder]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showOrderDetails = (order) => {
    const products = order.productsOrdered
      .map(
        (product) =>
          `${product.productName} (x${product.quantity}) - P${product.subtotal}`
      )
      .join('<br/>');

    const detailsHtml = `
      <strong>Products Ordered:</strong><br/>
      ${products}<br/>
      <hr/>
      <strong>Total Price: P${order.totalPrice}</strong>
    `;

    Swal.fire({
      title: 'Order Details',
      html: detailsHtml,
      confirmButtonText: 'Close',
    });
  };

  const updateStatus = (orderId) => {
    Swal.fire({
      title: "Are you sure to update order status to complete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, order is already processed / complete",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        fetch(`${process.env.REACT_APP_API_URL}/orders/complete/${orderId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Order status updated to Completed") {
              Swal.fire("Success", "Order status updated to Completed!", "success");
            } else {
              Swal.fire("Error", data.message, "error");
            }
          })
          .catch((err) => {
            Swal.fire("Error", "An error occurred while updating order status", "error");
          });
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    (user.id == undefined || user.id == null) ? 
      (<Navigate to="/login" />)
      :
      (user.isAdmin == true) ?
        (
          <Container className="mt-5">
            <h2>Order History</h2>
            
            {/* Search bar */}
            <Form.Control
              type="text"
              placeholder="Search by Order ID or User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="my-3"
            />

            {/* Sort by status toggle */}
            <div className="d-flex justify-content-end align-items-center mb-3 me-1">
              
              <Button
                variant="outline-secondary"
                onClick={() => setSortOrder(sortOrder === 'pendingFirst' ? 'completedFirst' : 'pendingFirst')}
              >
                {sortOrder === 'pendingFirst' ? 'Completed Items' : 'Pending Items'}
              </Button>
            </div>

            {currentOrders.length > 0 ? (
              <>
                <Table striped bordered hover className="mt-4">
                  <thead>
                    <tr className="row">
                      <th className="col-md-3 d-none d-md-table-cell">Order ID</th>
                      <th className="col-5 col-md-4">User Id</th>
                      <th className="col-md-1 d-none d-md-table-cell">Total</th>
                      <th className="col-2 col-md-2">Order Date</th>
                      <th className="col-5 col-md-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order._id} className="row">
                        <td className="col-md-3 d-none d-md-table-cell">{order._id}</td>
                        <td className="col-5 col-md-4">
                          <button
                            className="btn border mb-3"
                            onClick={() => toggleUserInfo(order._id, order.userId)}
                          >
                            {visibleOrders[order._id] ? 'See Less' : order.userId}
                          </button>

                          {visibleOrders[order._id] && userInfo[order._id] && (
                            <div className="mb-3">
                              User ID: {order.userId} <br />
                              Name: {userInfo[order._id].firstname} {userInfo[order._id].lastname} <br />
                              Email: {userInfo[order._id].email} <br />
                              Contact Number: {userInfo[order._id].contactNumber} <br />
                            </div>
                          )}
                        </td>
                        <td className="col-md-1 d-none d-md-table-cell">P {order.totalPrice}</td>
                        <td className="col-2 col-md-2">{new Date(order.orderedOn).toLocaleDateString()}</td>
                        <td className="col-5 col-md-2 d-flex flex-column gap-2">
                          {order.status === "Pending" ? (
                            <Button
                              variant="danger"
                              onClick={() => updateStatus(order._id)}
                            >
                              Pending
                            </Button>
                          ) : (
                            <Button variant="success">Completed</Button>
                          )}
                          <Button
                            variant="secondary"
                            onClick={() => showOrderDetails(order)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination controls */}
                <Pagination className="d-flex justify-content-center mb-5" variant="dark">
                  {[...Array(totalPages).keys()].map(pageNumber => (
                    <Pagination.Item
                      key={pageNumber + 1}
                      active={currentPage === pageNumber + 1}
                      onClick={() => paginate(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            ) : (
              <div>No orders available.</div>
            )}
          </Container>
        )
        :
        (<Navigate to="/products" />)
  );
}
