import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/productAPI';
import { Chip, Stack } from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductById(id)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '400px' }} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      {product.categories && (
        <Stack direction="row" spacing={1}>
          {product.categories.map((cat) => (
            <Chip key={cat} label={cat} />
          ))}
        </Stack>
      )}
      {/* Add to Cart button would go here */}
    </div>
  );
};

export default ProductDetails;