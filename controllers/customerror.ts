import {CustomError} from "../types.ts";
export const newCustomError= function (clas: string, message: string, sol: string ): CustomError{

    return {
        ErrorClass: clas,
        Message: message,
        Solution: sol
      }

}
export default newCustomError