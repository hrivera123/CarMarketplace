// client/src/api/offers.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export async function makeOffer(offerData) {
  const response = await axios.post(`${BASE_URL}/offers`, offerData);
  return response.data;
}

export async function fetchOffers(listingId) {
  const response = await axios.get(`${BASE_URL}/offers/${listingId}`);
  return response.data;
}