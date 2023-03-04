import { respondWithError, respondWithSuccess } from "../../../helpers/apiResponse";
import { prisma } from "../../../prisma/client";

async function handler(req, res) {
    const { fullname, password } = req.body;

    if (!fullname || !password)
        return respondWithError({ res: res, message: "Username, password fields are required", httpCode: 400 });

    try {
        const user = await prisma.users.findFirst({
            where: {
                fullname: fullname,
                password: password
            },
            include: {
                role: true
            }
        });

        if (!user)
            return respondWithError({ res: res, message: "Could not log in with given credentials" })

        return respondWithSuccess({ res: res, message: "User successfully created", payload: { user: user } })

    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
};

export default handler;