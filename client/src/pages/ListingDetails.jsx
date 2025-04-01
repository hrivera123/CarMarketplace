// client/src/pages/ListingDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageModal from '../components/ImageModal';
import { makeOffer, fetchOffers } from '../api/offers';
import { AuthContext } from '../context/AuthContext';

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offerFormVisible, setOfferFormVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offers, setOffers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching listing details.');
      }
    };
    fetchListingDetails();
    loadOffers();
  }, [id]);

  const loadOffers = async () => {
    try {
      const data = await fetchOffers(id);
      setOffers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBuyItNow = () => {
    alert(`Buying listing for $${listing.price}`);
    // Add further purchase logic as needed.
  };

  const toggleOfferForm = () => {
    setOfferFormVisible(!offerFormVisible);
  };

  const handleMakeOffer = async () => {
    if (!user) {
      alert("Please log in to make an offer");
      return;
    }
    if (!offerAmount || isNaN(offerAmount)) {
      alert("Enter a valid offer amount");
      return;
    }
    try {
      const offerData = {
        listing_id: id,
        user_id: user.id,
        offer_amount: parseFloat(offerAmount)
      };
      await makeOffer(offerData);
      alert("Offer submitted successfully");
      setOfferAmount("");
      loadOffers();
    } catch (err) {
      console.error(err);
      alert("Error making offer");
    }
  };

  if (error) return <div>{error}</div>;
  if (!listing) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {listing.make} {listing.model} ({listing.year})
      </h2>
      <p><strong>Price:</strong> ${listing.price}</p>
      <p><strong>Mileage:</strong> {listing.mileage} miles</p>
      <p><strong>Transmission:</strong> {listing.transmission}</p>
      <p><strong>Fuel Type:</strong> {listing.fuelType}</p>
      <p><strong>Body Type:</strong> {listing.bodyType}</p>
      <p><strong>Color:</strong> {listing.color}</p>
      <p><strong>Description:</strong> {listing.description}</p>
      <p><strong>Seller:</strong> {listing.seller_email}</p>
      {listing.images && listing.images.length > 0 && (
        <div>
          <h3>Images:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {listing.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img}`}
                alt={`${listing.make} ${listing.model} ${index + 1}`}
                style={{ width: '200px', marginRight: '10px', cursor: 'pointer' }}
                onClick={() => openModal(index)}
              />
            ))}
          </div>
        </div>
      )}
      {modalOpen && (
        <ImageModal
          images={listing.images.map((img) => `http://localhost:5000/${img}`)}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onPrev={showPrevImage}
          onNext={showNextImage}
        />
      )}
      {/* Buy It Now and Make Offer Buttons */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleBuyItNow}>
          Buy It Now for ${listing.price}
        </button>{' '}
        <button onClick={toggleOfferForm}>
          Make an Offer
        </button>
      </div>
      {/* Offer form */}
      {offerFormVisible && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            placeholder="Offer amount"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
          />
          <button onClick={handleMakeOffer}>Submit Offer</button>
        </div>
      )}
      {/* Offers Table (only on the Listing Details page) */}
      {offers && offers.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3 style={{ textAlign: 'center' }}>Offers Made</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>User Email</th>
                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>Offer Amount</th>
                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>Date Made</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id}>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{offer.user_email}</td>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>${offer.offer_amount}</td>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{offer.date_made}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;