import React, { useState, useContext } from 'react';
import { createListing } from '../api/listings';
import { AuthContext } from '../context/AuthContext';

function NewListing() {
  const { user } = useContext(AuthContext);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
    setResult(null); // Reset result when new images are selected
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to create a listing.');
      return;
    }

    try {
      const listingData = {
        seller_id: user.id,
        make,
        model,
        year: parseInt(year) || 0,
        mileage: parseInt(mileage) || 0,
        price: parseFloat(price.replace(/[^0-9.]/g, '')) || 0,
        transmission,
        fuelType,
        bodyType,
        color,
        description,
        images,
      };
      const data = await createListing(listingData);
      setMessage(`Listing created with ID: ${data.listingId}`);
      // Clear form fields after successful submission
      setMake('');
      setModel('');
      setYear('');
      setMileage('');
      setPrice('');
      setTransmission('');
      setFuelType('');
      setBodyType('');
      setColor('');
      setDescription('');
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage('Error creating listing');
    }
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      setMessage('Please select images to upload.');
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('image', image);
    });

    try {
      console.log("Uploading images...");
      const response = await fetch('http://localhost:5001/upload', { // Ensure this matches the backend endpoint
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log("Response from server:", data);
      // Extract class and confidence
      const filteredResults = data.map(item => ({
        class: item.predictions[0].class,
        confidence: item.predictions[0].confidence
      }));
      setResult(filteredResults);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error uploading images');
    }
  };

  return (
    <div>
      <h2>Create a New Listing</h2>
      {message && <p>{message}</p>}
      <div>
        <h3>Upload your picture to identify your car</h3>
        <h5> Please note that this trained model isn't 100% accurate please double check the results before listing</h5>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="button" onClick={handleUpload}>Upload Picture and Get Results</button>
      </div>
      {result && (
        <div>
          <h2>Recognition Results:</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                Class: {item.class}, Confidence: {item.confidence.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleCreate}>
        <div>
          <label>Make:</label>
          <input value={make} onChange={(e) => setMake(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Model:</label>
          <input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Year:</label>
          <input value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Mileage:</label>
          <input value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Price:</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Transmission:</label>
          <input value={transmission} onChange={(e) => setTransmission(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Fuel Type:</label>
          <input value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Body Type:</label>
          <input value={bodyType} onChange={(e) => setBodyType(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Color:</label>
          <input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Select Images:</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <br />
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
}

export default NewListing;
