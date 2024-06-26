# Product Management System

## Overview

The Product Management System is a React-based web application designed to display a list of products with various functionalities such as pagination, search, filtering, and sorting. The data is fetched from a remote API and displayed in a table format using the Material-UI DataGrid component.

## Features

- Pagination: Navigate through pages of products.
- Search: Search products by name.
- Filter: Filter products by category.
- Sorting: Sort products by different columns except for the image column.
- Responsive Design: Ensures a good user experience on different screen sizes.

## Technologies Used

- React: JavaScript library for building user interfaces.
- Material-UI: React components for faster and easier web development.
- Axios: Promise-based HTTP client for the browser and Node.js.
- React Router: Declarative routing for React applications.
- Debounce: Custom debounce hook for optimizing search input.

## Installation

1. Clone the repository:
git clone https://github.com/Vakar18/Retail_Shop

2. Install dependencies:
npm install

3. Start the application:
npm start

## Components

### ProductList.js

This is the main component that displays the list of products in a table format with features like search, filter, sort, and pagination.

- State Variables
  - products: List of all products fetched from the API.
  - filteredProducts: List of products after applying search, filter, and sort.
  - loading: Boolean indicating if the data is being loaded.
  - page: Current page number.
  - pageSize: Number of products per page.
  - totalPages: Total number of pages.
  - searchQuery: Search query string.
  - category: Selected category for filtering.
  - categories: List of unique categories.
  - sortModel: Current sort model.
  - selectedProductId: ID of the selected product.
- Effects and Callbacks:
  - fetchData: Fetches the product data from the API.
  - applySort: Applies sorting to the product list.
  - applyFilters: Applies search and filter to the product list.
  - handlePageChange: Updates the current page.
  - handleSortModelChange: Updates the current sort model.
  - handleRowClick: Navigates to the product detail page when a row is clicked.

## useDebounce.js

Custom hook to debounce the search input, reducing the number of API calls.

## API

The application fetches product data from the following API endpoint:
https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products

## Usage

- Search Products: Enter a product name in the search box to filter the product list by name.
- Filter by Category: Select a category from the dropdown to filter the products by the selected category.
- Sort Products: Click on the column headers to sort the products by that column (except for the image column).
- Pagination: Use the pagination controls at the bottom of the table to navigate through pages of products.
- View Product Details: Click on a product row to navigate to the product detail page.
