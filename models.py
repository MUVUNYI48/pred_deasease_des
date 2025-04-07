from mongoengine import Document, StringField, DateTimeField, FloatField

class UploadedImage(Document):
    image = StringField(required=True)  # Store image path
    uploaded_at = DateTimeField()
    predicted_disease = StringField(max_length=255)

    def __str__(self):
        return f"{self.image} - {self.predicted_disease}"

class PredictionResult(Document):
    image = StringField(required=True)  # Store image path
    class_name = StringField(required=True)
    confidence = FloatField()
    created_at = DateTimeField()

    def __str__(self):
        return f"{self.class_name} ({self.confidence:.2f})"
