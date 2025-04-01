from flask import Flask, request, jsonify, send_from_directory
import os
from inference_sdk import InferenceHTTPClient, __version__ as inference_sdk_version
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)  # Enable CORS

# API key for InferenceHTTPClient
API_KEY = "nbliTNrwcLrXnPu9zuIN"  # Replace with your actual private API key

# Initialize the InferenceHTTPClient
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=API_KEY
)

# Log the Inference SDK version and API Key
print(f"Inference SDK Version: {inference_sdk_version}")
print(f"Inference API Key: {API_KEY}")  # Log the API key for verification

@app.route('/upload', methods=['POST'])
def upload_image():
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    images = request.files.getlist('image')
    if not images:
        return jsonify({"error": "No images uploaded"}), 400

    results = []
    for image in images:
        print(f"Processing image: {image.filename}")
        image_path = os.path.join('uploads', image.filename)
        try:
            image.save(image_path)
            print(f"Image saved to {image_path}")
        except Exception as e:
            print(f"Error saving image: {e}")
            return jsonify({"error": f"Error saving image: {e}"}), 500

        try:
            # Use the InferenceHTTPClient to make API calls
            result = CLIENT.infer(image_path, model_id="car-make-and-model-identification-2/2")
            results.append(result)
        except Exception as e:
            print(f"Error making API request: {e}")
            return jsonify({"error": f"Error making API request: {e}"}), 500

    return jsonify(results)

@app.route('/faq', methods=['POST'])
def faq():
    """
    Simple endpoint to respond to FAQ queries.
    """
    faq_data = {
        "How to list a car?": "To list a car, you have to login click on 'Create Listing' and fill in the required details, including car information and photos.",
        "How do I create an account?" : " Click on 'Register' and add the email and password you'd like to use for your account.",
        "How do I contact the seller?": "You can message the seller directly using the 'Contact Seller' button on the car listing page.",
        "How do I use the 'Car Make/Model Classification' ? ": "Upload a picture of your car by clicking on 'Choose Files' then once a picture has been chosen click on 'Upload Picture and get results' on the bottom you'll get the results on the bottom. Please remeber these results arent 100% accurate ", 
        "How do I view my listings ?" : "Click on 'View Listings'.",
        "What if I don't know my car's make or model?" : "Use the Car Make/Model Classification.",
        "How do I know if someone is interested in my car? " : "You will get a notification. ", 
        "My question isnt listed, what do i do?" : " Please refer to the 'Contact Us' section , feel free to leave any questiosn and it will be send to our email. We'll get back to you right away !"
    }
    
    user_question = request.json.get("question")
    if not user_question or user_question not in faq_data:
        return jsonify({"answer": "Sorry, I don't have an answer to that question."}), 400

    return jsonify({"answer": faq_data[user_question]})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5001)
