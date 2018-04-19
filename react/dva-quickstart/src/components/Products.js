import React from 'react';
import {connect} from 'dva';
import ProductList from '../components/ProductList';

const Products = ({dispatch,products}) => {
   function handleDelete(id) {
       dispatch({
           type:'products/delete',
           payload:id,
       });
   }
   return (
       <div>
           <h2>list of products</h2>
           <ProductList onDelete={handleDelete} products={products}></ProductList>
       </div>
   )
}

export default connect(({products}) => ({
    products,
}))(Products);