import dotenv from 'dotenv'

dotenv.config()

function requiredVariable(name){
    if(!process.env[name]){
        throw new Error (`environment variable ${name} is required`)
    }
    return process.env[name]
}

 const config = {
    MONGO_URI: requiredVariable("MONGO_URI"),
    JWT_SECRET_KEY: requiredVariable("JWT_SECRET_KEY"),
    IMAGEKIT_PRIVATE_KEY : requiredVariable("IMAGEKIT_PRIVATE_KEY")
}

export default config