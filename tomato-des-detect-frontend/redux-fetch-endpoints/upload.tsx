import axios from "axios";
const upload_Url = "http://localhost:8000/api/upload/";
const allPredictions_Url="http://localhost:8000/api/predictions/";
export const uploadImage = async (formData) => {
    try {
        
        const response = await axios.post(upload_Url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
    
        console.log("Image uploaded successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export const getAllPredictions=async () => {
    try {

        const response=await axios.get(allPredictions_Url, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }}
        )
        return response.data;
    }
        catch(error){
            console.error("Error uploading image:", error);
            throw error;
        }
    }

    // the folllowing is for deleting

    export const deletePrediction=async (id) => {
        try {
            const response=await axios.delete(`http://localhost:8000/api/predictions/${id}/delete/`, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }}
            )
            return response.data;
        }
            catch(error){
                console.error("Error uploading image:", error);
                throw error;
            }
        }