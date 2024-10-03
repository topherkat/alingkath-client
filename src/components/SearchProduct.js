import React, { useState, useEffect } from 'react'; 
import ProductCard from "./ProductCard"; // Ensure you have a ProductCard component

export default function SearchProduct() { // Changed from CourseSearch to ProductSearch

  const [productName, setProductName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
   
    
    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: productName }), // Sending productName instead of courseName
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setError(data.message || 'Error searching for product.');
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      setError('An error occurred while searching for the product.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mt-5 mb-5">
     
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      <form onSubmit={handleSearch}>
        <div className="form-group d-flex gap-2">
         
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}   
            placeholder="Input to search a product"
          />

           <button type="submit" className="btn btn-success h-100">Search</button>
        </div>
       
      </form>


      {searchResults.length > 0 && (
        <div className={productName? "mt-4" : "d-none"}>
          <h3>Search Results</h3>
          <ul className="list-group">
            {searchResults.map((product) => (
              <ProductCard key={product._id} productProp={product} /> 
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
