from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from .ml_model.predict import predict_disease
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UploadedImage
from django.core.files.storage import default_storage
# from .ml_model.predict import predict_disease
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import PredictionResult
from django.shortcuts import get_object_or_404


@api_view(['POST'])
@login_required
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({"error": "No image uploaded"}, status=400)

    image = request.FILES['image']
    saved_path = default_storage.save(f"uploaded_images/{image.name}", image)
    
    prediction = predict_disease(saved_path)

    uploaded_image = UploadedImage.objects.create(image=saved_path, predicted_disease=prediction)
    return Response({"prediction": prediction})


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your account has been created! You can now log in.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})


@login_required
def view_results(request):
    return render(request, 'view_results.html')

@login_required
def upload_image(request):
    if request.method == 'POST' and request.FILES['image']:
        # Save the uploaded image
        image = request.FILES['image']
        fs = FileSystemStorage()
        image_path = fs.save(image.name, image)
        image_url = fs.url(image_path)

        # Predict the disease
        class_name, confidence = predict_disease(fs.path(image_path))

        # Save the result to the database
        prediction = PredictionResult.objects.create(
            image=image, class_name=class_name, confidence=confidence
        )

        # Render results
        return render(request, 'results.html', {
            'image_url': image_url,
            'class_name': class_name,
            'confidence': confidence
        })

    return render(request, 'upload_image.html')

@login_required
def list_predictions(request):
    predictions = PredictionResult.objects.all()
    return render(request, 'list_predictions.html', {'predictions': predictions})

@login_required
def delete_prediction(request, pk):
    prediction = get_object_or_404(PredictionResult, pk=pk)
    prediction.delete()
    return redirect('list_predictions')
