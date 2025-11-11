import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

export const geraToken = ( user ) => {
    const { id, email, creditos } = user

    return jsonwebtoken.sign({id: id, email: email, creditos: creditos }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

export const verificaToken = ( token ) => {
    try {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET)
    }catch (error) {
        return null
    }
}
