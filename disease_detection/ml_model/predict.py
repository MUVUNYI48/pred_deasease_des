from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np


tf.config.set_visible_devices([], 'GPU')

# Load the trained model
model = load_model("tomato_disease_model.keras")

# Define a mapping of class indices to class names
CLASS_NAMES = [
    "Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", 
    "Septoria Leaf Spot", "Spider Mites", "Target Spot", 
    "Yellow Leaf Curl Virus", "Mosaic Virus", "Healthy", "Other"
]

def predict_disease(image_path):
    # Load and preprocess the image
    img = load_img(image_path, target_size=(128, 128))  # Resize to match model input
    img_array = img_to_array(img) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension



    # Make prediction
    predictions = model.predict(img_array)
    print("predictions", predictions)
    class_index = np.argmax(predictions, axis=1)[0]  # Get the class index
    confidence = float(predictions[0][class_index])  # Get confidence score

    class_name = CLASS_NAMES[class_index]  # Map index to class name
    return class_name, confidence

# Example usage
# image_path = "path_to_uploaded_image.jpg"
# class_index, confidence = predict_disease(image_path)
# print(f"Predicted class: {class_index}, Confidence: {confidence}")
