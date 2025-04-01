import React, { useState, useEffect, useContext } from 'react';
import { fetchAllListings, deleteListing } from '../api/listings';
import { makeOffer } from '../api/offers';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Listings() {
  const [listings, setListings] = useState([]);
  const { user } = useContext(AuthContext);
  const [offerForms, setOfferForms] = useState({});
  const [offerAmounts, setOfferAmounts] = useState({});

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await fetchAllListings();
      setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteListing(id);
      loadListings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyItNow = (listing) => {
    alert(`Buying listing for $${listing.price}`);
    // Additional purchase logic can be added here.
  };

  const toggleOfferForm = (listingId) => {
    setOfferForms(prev => ({ ...prev, [listingId]: !prev[listingId] }));
  };

  const handleMakeOffer = async (listingId) => {
    if (!user) {
      alert("Please log in to make an offer");
      return;
    }
    const amount = offerAmounts[listingId];
    if (!amount || isNaN(amount)) {
      alert("Enter a valid offer amount");
      return;
    }
    try {
      const offerData = {
        listing_id: listingId,
        user_id: user.id,
        offer_amount: parseFloat(amount)
      };
      await makeOffer(offerData);
      alert("Offer submitted successfully");
      setOfferAmounts(prev => ({ ...prev, [listingId]: "" }));
      // We do not load offers on this page since the table is not shown.
    } catch (err) {
      console.error(err);
      alert("Error making offer");
    }
  };

  return (
    <div>
      <h2>All Car Listings</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {listings.map((listing) => (
          <li
            key={listing.id}
            style={{
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid black'
            }}
          >
            <Link to={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <strong>
                {listing.make} {listing.model} ({listing.year})
              </strong>{' '}
              - ${listing.price}
              <br />
              Mileage: {listing.mileage} miles
              <br />
              Seller: {listing.seller_email}
              <br />
              <small>{listing.description}</small>
            </Link>
            {/* Display image thumbnails */}
            {listing.images && listing.images.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {listing.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${img}`}
                    alt={`${listing.make} ${listing.model} ${index + 1}`}
                    style={{ width: '100px', marginRight: '10px' }}
                  />
                ))}
              </div>
            )}
            {/* Action buttons */}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleBuyItNow(listing)}>
                Buy It Now for ${listing.price}
              </button>{' '}
              <button onClick={() => toggleOfferForm(listing.id)}>
                Make an Offer
              </button>
              {user && user.id === listing.seller_id && (
                <button onClick={() => handleDelete(listing.id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              )}
            </div>
            {/* Offer form (without offers table) */}
            {offerForms[listing.id] && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="number"
                  placeholder="Offer amount"
                  value={offerAmounts[listing.id] || ""}
                  onChange={(e) =>
                    setOfferAmounts(prev => ({ ...prev, [listing.id]: e.target.value }))
                  }
                />
                <button onClick={() => handleMakeOffer(listing.id)}>Submit Offer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Listings;