from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import tensorflow as tf


tf.config.set_visible_devices([], 'GPU')

# Load the trained model
model = load_model("tomato_disease_model.keras")


# Define class names and recommendations
# CLASS_NAMES = {
#     "Bacterial Spot": "Apply copper-based fungicides and avoid overhead watering.",
#     "Early Blight": "Use fungicides with chlorothalonil and remove affected leaves.",
#     "Late Blight": "Destroy infected plants and apply systemic fungicides.",
#     "Leaf Mold": "Improve air circulation and apply fungicides containing mancozeb.",
#     "Septoria Leaf Spot": "Avoid watering leaves and apply fungicides regularly.",
#     "Spider Mites": "Spray neem oil or insecticidal soap to control infestation.",
#     "Target Spot": "Apply organic fungicides and avoid excessive humidity.",
#     "Yellow Leaf Curl Virus": "Control whiteflies and use virus-resistant varieties.",
#     "Mosaic Virus": "Remove infected plants and disinfect garden tools.",
#     "Healthy": "Maintain good soil health and regular watering.",
#     "Other": "Monitor plant health and apply general care techniques."
# }

CLASS_NAMES = [
    "Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold",
    "Septoria Leaf Spot", "Spider Mites", "Target Spot",
    "Yellow Leaf Curl Virus", "Mosaic Virus", "Healthy", "Other"
]

def predict_disease(image_path):
    """Predicts the disease in a given tomato leaf image."""
    # Load and preprocess the image
    img = load_img(image_path, target_size=(128, 128))  # Resize to model input size
    img_array = img_to_array(img) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Make prediction
    predictions = model.predict(img_array)
    class_index = np.argmax(predictions, axis=1)[0]  # Get the class index
    confidence = float(predictions[0][class_index])  # Get confidence score
    class_name = CLASS_NAMES[class_index]  # Map index to class name

    return class_name, confidence
