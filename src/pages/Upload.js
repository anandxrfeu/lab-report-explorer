import Navbar from "../components/layout/Navbar";
import { useState } from "react"



const Upload = () => {

    const [imageUrl, setImageUrl] = useState("")


    const handleFileUpload = async (e) =>{
        const uploadData = new FormData()
        uploadData.append("imageUrl", e.target.files[0])
        try{
            console.log("uploadData ", uploadData)
            //const data = await apiService.uploadFile(uploadData)
            //setImageUrl(data.filePath)
        }catch(err){
            console.log(err)
        }
      }

    return(
        <div>
            <Navbar />
            <div className="upload_section">
            <input
                type="file"
                name="imageUrl"
                onChange={handleFileUpload}
            />
            <button
                disabled={imageUrl === ""}
                className="profile-form-controls_btn badge-pill">Save</button>
            </div>
        </div>
    )

}

export default Upload