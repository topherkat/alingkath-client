import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';  // Component to display individual products

export default function UserView({ productsData }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log(productsData);

        // Filter and display only active products
        const productsArr = productsData.map(product => {
            if (product.isActive === true) {
                return (
                    <ProductCard productProp={product} key={product._id} />
                );
            } else {
                return null;
            }
        });

        setProducts(productsArr);

    }, [productsData]);

    return (
        <>
            <h1 className="text-center my-4 ">Available Products</h1>
            <div className="row justify-content-between g-3 p-4">
                {products}
            </div>
        </>
    );
}
