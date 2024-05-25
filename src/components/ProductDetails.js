import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Card, CardContent, CardMedia, Typography, CircularProgress } from '@mui/material';
import "../index.css"

const ProductDetail = () => {
  const { state } = useLocation();
  const { productId } = useParams();
  const [product, setProduct] = useState(state ? state.product : null);
  const [loading, setLoading] = useState(!state);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=1&limit=10&id=${productId}`
          );
          if (response.data && response.data.products && response.data.products.length > 0) {
            setProduct(response.data.products[0]);
          } else {
            setProduct(null);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [product, productId]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', my: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : product ? (
        <Card sx={{ maxWidth: 600, margin: 'auto' }}>
          <CardMedia
            component="img"
            height="400"
            image={product.images?.front}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?w=740&t=st=1716582911~exp=1716583511~hmac=e368eda2fc1f9efecdff122008d066def5792789623a346e0954939684ad1aa2';
            }}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2">
              Brand: {product.brand}
            </Typography>
            <Typography variant="body2">
              Category: {product.main_category}
            </Typography>
            <Typography variant="body2">
              Price: ${product.mrp?.mrp}
            </Typography>
            <Typography variant="body2"sx={{ mt: 2 }}>
              Description: {product.description}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">Product not found</Typography>
      )}
    </Box>
  );
};

export default ProductDetail;
