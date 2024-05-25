import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { CircularProgress, Box, TextField, MenuItem, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useDebounce from './useDebounce'; 
import "../index.css";

const columns = [
  { field: 'id', headerName: 'S.No', width: 90 },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'brand', headerName: 'Brand', width: 150 },
  { field: 'category', headerName: 'Category', width: 200 },
  { field: 'price', headerName: 'Price(in $)', type: 'number', width: 130 },
  {
    field: 'image',
    headerName: 'Image',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <img
        src={params.value}
        alt="product"
        style={{ width: '100%' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'nodata.jpg';
        }}
      />
    ),
  },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const applySort = useCallback((productsList, sortModel) => {
    if (sortModel.length) {
      const sortField = sortModel[0].field;
      const sortOrder = sortModel[0].sort;
      return productsList.sort((a, b) => {
        if (sortField === 'price') {
          return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        } else {
          return sortOrder === 'asc'
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        }
      });
    }
    return productsList;
  }, []);

  const applyFilters = useCallback((productsList) => {
    let tempProducts = [...productsList];
    if (debouncedSearchQuery) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    if (category) {
      tempProducts = tempProducts.filter((product) => product.category === category);
    }
    return applySort(tempProducts, sortModel);
  }, [debouncedSearchQuery, category, sortModel, applySort]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=${page}&limit=${pageSize}`
      );

      const productsPerPage = pageSize;
      const startIndex = (page - 1) * productsPerPage + 1;
      const fetchedProducts = result.data.products.map((product, index) => ({
        ...product,
        id: startIndex + index,
        image: product.images.front,
        price: product.mrp.mrp,
        category: product.main_category,
      }));

      setProducts(fetchedProducts);
      setFilteredProducts(applyFilters(fetchedProducts));
      setTotalPages(result.data.totalPages);

      const uniqueCategories = [...new Set(fetchedProducts.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, applyFilters]);

  useEffect(() => {
    fetchData();
  }, [page, category, sortModel, debouncedSearchQuery, fetchData]);

  useEffect(() => {
    setFilteredProducts(applyFilters(products));
  }, [products, debouncedSearchQuery, category, sortModel, applyFilters]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const handleRowClick = (params) => {
    const productId = params.row.id;
    const selectedProduct = products.find(product => product.id === productId);
    if (productId !== selectedProductId) {
      setSelectedProductId(productId);
      navigate(`/product/${productId}`, { state: { product: selectedProduct } });
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TextField
        select
        label="Filter by Category"
        variant="outlined"
        fullWidth
        margin="normal"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      {loading ? (
        <Box sx={{ height: 'calc(100vh - 264px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', mt: 2 }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSizeOptions={[20]}
            checkboxSelection
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            getRowHeight={() => 120}
            onRowClick={handleRowClick}
          />
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'center', width: "100%" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductList;
