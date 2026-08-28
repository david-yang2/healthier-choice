import { createContext, useState } from "react";

export const ImageContext = createContext({})


export const ImageProvider = ({children}) => {
    const [imageFile, setImageFile] = useState("")

    return <ImageContext.Provider
    // provide image context to children components
    value={{imageFile, setImageFile}}>
        {children}
    </ImageContext.Provider>

}