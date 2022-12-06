import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios"
import Navbar from "../components/layout/Navbar";

const Search = () => {

    const [loading, setLoading] = useState(true)
    const [files, setFiles] = useState([])
    const location = useLocation()

    useEffect( ()=>{

    // Parse query string to see if page request is coming from OAuth 2.0 server.
        const fragmentString = location.hash.substring(1);
        let params = {};
        let regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(fragmentString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
    //save oauth params in local storage and make api call to resource server
        if (Object.keys(params).length > 0) {
            localStorage.setItem('oauth2-params', JSON.stringify(params) );
            if (params['state'] && params['state'] === process.env.REACT_APP_CSRF_STATE) {
                fetchData(params)
            }
        }

    // api call to resource server
        async function fetchData (params) {
            try{
                const access_token = params["access_token"]
                const GDRIVE_FILES_END_POINT_URI = process.env.REACT_APP_GDRIVE_API_END_POINT
                // get file id for the health folder
                const result = await axios.get(GDRIVE_FILES_END_POINT_URI,{
                       params:{
                            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
                            fields: 'nextPageToken, files(id, name)',
                            spaces: 'drive',
                       },
                       headers: {
                        authorization: `Bearer ${access_token}`
                    }
                    }
                )
                const folder = result.data.files.filter(x => x.name === process.env.REACT_APP_GDRIVE_FOLDER_NAME);
                const folderId = folder.length? folder[0].id : 0;

                // get all pdf files in above folder
                const mimeType = "application/pdf"
                const response = await axios.get(GDRIVE_FILES_END_POINT_URI,{
                    params:{
                        q: `'${folderId}' in parents and mimeType:'${mimeType}'`,
                        fields: 'files(id,name,mimeType,webContentLink ,size)',
                        spaces: 'drive',
                      },
                    headers: {
                        authorization: `Bearer ${access_token}`
                    }
                })
                setLoading(false)
                setFiles(response.data.files)
            }catch(err){
                console.log("err> ", err)
                if(err.response.status === 401){
                    console.log("Please sign in again!")
                }

            }
        }

    }, [])

    if(loading){
        return <p>Searching...</p>
    }

    return(
        <div>
            <Navbar />
            {files && files.length > 0 && (
                 files.map(file => <p key={file.id}>{file.name} <a href={file.webContentLink}>download</a></p>)
            )}
        </div>
        )

}

export default Search