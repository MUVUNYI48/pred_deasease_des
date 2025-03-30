from dask.distributed import Client

# Initialize Dask client
client = Client()

def distributed_processing(images):
    futures = client.map(predict_disease, images)
    results = client.gather(futures)
    return results
