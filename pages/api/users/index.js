import createUser from "../../../controllers/users/createUser";
import getUsers from "../../../controllers/users/getUsers";
import { respondWithError } from "../../../helpers/apiResponse";

export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            getUsers(req, res);
            break;
        case "POST": ;
            createUser(req, res)
        default:
            respondWithError({ res: res, message: "Method not allowed", httpCode: 405 })
    }
}