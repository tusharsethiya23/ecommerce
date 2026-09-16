import ImageKit from '@imagekit/nodejs'
import config from '../config/config.js'

const client = new ImageKit(
    {
        privateKey:config.IMAGEKIT_PRIVATE_KEY
    }
)

export  const uploadFiles = async(file, fileName)=>{
    const respnse = await client.files.upload(
        {
            file,
            fileName,
            folder:"/snitch"
        }
    )
    return respnse
}
