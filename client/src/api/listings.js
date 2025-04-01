// client/src/api/listings.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export async function fetchAllListings() {
  const response = await axios.get(`${BASE_URL}/listings`);
  return response.data;
}

export async function createListing(listingData) {
  // Create a FormData object
  const formData = new FormData();
  
  // Append text fields
  formData.append('seller_id', listingData.seller_id);
  formData.append('make', listingData.make);
  formData.append('model', listingData.model);
  formData.append('year', listingData.year);
  formData.append('mileage', listingData.mileage);
  formData.append('price', listingData.price);
  formData.append('transmission', listingData.transmission);
  formData.append('fuelType', listingData.fuelType);
  formData.append('bodyType', listingData.bodyType);
  formData.append('color', listingData.color);
  formData.append('description', listingData.description);
  
  // Append each image file
  if (listingData.images && listingData.images.length > 0) {
    listingData.images.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  const response = await axios.post(`${BASE_URL}/listings`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export async function deleteListing(listingId) {
  const response = await axios.delete(`${BASE_URL}/listings/${listingId}`);
  return response.data;
}