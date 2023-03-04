import { prisma } from "../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../helpers/apiResponse";

async function getUsers(req, res) {
    try {
        const users = await prisma.users.findMany({
            include: {
                role: true
            }
        });

        return respondWithSuccess({ res: res, message: "Users successfully listed", payload: { users: users } })

    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
};

export default getUsers;