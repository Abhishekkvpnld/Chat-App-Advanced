import {isValidUsername} from "6pp";

export const usernameValidators = (username)=>{
if(!isValidUsername(username))
    return {isValid:false,errorMessage:"username is Invalid"}
}