import { prisma } from "../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../helpers/apiResponse";
import withAuth from "../../middlewares/withAuth";

async function handler(req, res) {
    const { fullname, password, role_id } = req.body;

    if (!fullname || !password || role_id)
        return respondWithError({ res: res, message: "Username, password, role_id fields are required", httpCode: 400 });

    try {
        const user = await prisma.users.create({
            data: {
                fullname: fullname,
                password: password,
                role_id: role_id
            }
        })

        return respondWithSuccess({ res: res, message: "User successfully created", payload: { user: user } })

    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
};

export default withAuth(handler);