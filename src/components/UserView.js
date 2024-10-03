import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';  // Component to display individual products
import SearchProduct from './SearchProduct';
import { Notyf } from 'notyf'; // imports the notyf module




export default function UserView({ productsData }) {


    const notyf = new Notyf(); // <---

    const [products, setProducts] = useState([]);


    useEffect(()=>{
        if(!products){
            notyf.error("Data not yet available. Please wait."); // Handle errors
        }      
    },[]);
    
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
            <SearchProduct />
            <h1 className="text-center my-4 ">Available Products</h1>
            <div className="row  g-3 p-4">
                {products}
            </div>
        </>
    );
}
