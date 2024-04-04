
import { getSockets } from "../lib/helper.js";

 const emitEvent = (req,event,users,data)=>{
    const io = req.app.get("io");
    const userSockets = getSockets()
   io.to(userSockets).emit(event,data);
}

export default emitEvent;