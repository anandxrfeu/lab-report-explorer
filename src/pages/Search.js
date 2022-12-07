import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios"
import Navbar from "../components/layout/Navbar";

const Search = () => {

    const [loading, setLoading] = useState(true)
    const [files, setFiles] = useState([])
    const [filesCopy, setFilesCopy] = useState([])

    const location = useLocation()

    let folderId = 0
    const mimeType = "application/pdf"
    const GDRIVE_FILES_END_POINT_URI = process.env.REACT_APP_GDRIVE_API_END_POINT

    const searchTerm = useRef("")

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
                folderId = folder.length? folder[0].id : 0;
                localStorage.setItem("folderId", folderId)

                // get all pdf files in above folder
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
                setFilesCopy(response.data.files)
            }catch(err){
                console.log("err> ", err)
                if(err.response.status === 401){
                    console.log("Please sign in again!")
                }

            }
        }

    }, [])


    const onSearchHandler = async (e) => {
        e.preventDefault()
        const params = JSON.parse(localStorage.getItem("oauth2-params"))
        const access_token = params.access_token
        //console.log("Access token > ",params.access_token)
        //console.log("searchTerm  ", searchTerm.current.value)
        folderId = localStorage.getItem("folderId")
        //console.log("folderId", folderId)

        if (searchTerm === "") return;
        
        try{
        
            // get all pdf files in above folder
            const response = await axios.get(GDRIVE_FILES_END_POINT_URI,{
            params:{
                q: `'${folderId}' in parents and mimeType:'${mimeType}' and fullText contains '${searchTerm.current.value}'`,
                fields: 'files(id,name,mimeType,webContentLink ,size)',
                spaces: 'drive',
              },
            headers: {
                authorization: `Bearer ${access_token}`
            }
            })
            //console.log("response.data.files ",response)
            console.log("response.data.files ",response.data.files)
            // setLoading(false)
//            setFiles(response.data.files)
            setFilesCopy(response.data.files)

        }catch(err){
            console.log("err> ", err)
            if(err.response.status === 401){
                console.log("Please sign in again!")
            }

        }

    }

    const onChangeHandler = (e) =>{
        if(e.target.value === ""){
            setFilesCopy(files)
        }
    }


    if(loading){
        return <p>Searching...</p>
    }

    return(
        <div>
            <Navbar />
            <div className="search">
                <input type="search" ref={searchTerm} onChange={onChangeHandler}/>
                <button onClick={onSearchHandler}>Search</button>
            </div>
            <div className="file_section">
                {filesCopy && filesCopy.length > 0 && (
                    filesCopy.map(file => (
                        <div>
                            <p key={file.id}>{file.name} <a href={file.webContentLink}>download</a></p>
                        </div>
                        ))
            )}
            </div>
        </div>
        )

}

export default Search