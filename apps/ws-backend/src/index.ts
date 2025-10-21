import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,request) {
    //TO GET THE URL THE USER IS TRYING TO CONNECT TO 
    const url = request.url
    if (!url) {
        return
    }
    //TO GET THE QUERYPARAMETERS THEY ARE TRYING TO CONNECT TO 
    const queryParams = new URLSearchParams(url.split("?")[1])

    //TO GET THE TOKEN THEY HAVE SENT FROM THE QUERY PARAMETER
    const token = queryParams.get("name") || ""

    //DECODING THE TOKEN
    const decoded = jwt.verify(token, JWT_SECRET)

    //MAKING SURE THE TOKEN IS VALID WITH THE ROOM WHICH THEY WANT TO CONNECT . IF NOT CLOSING THE  CONNECTION NOT LETTING THE USER ENTER 
    if (typeof decoded == "string") {
        ws.close()
        return
    }
    if (!decoded || !decoded.userId) {
        
        ws.close()
        return   
    }

    ws.on('message', function message(data) {

        ws.send('pong')
        
    })
})