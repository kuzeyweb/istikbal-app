import { getSession } from 'next-auth/react'
import { respondWithError } from '../helpers/apiResponse'

const withProtect = (handler) => {
    return async (req, res) => {
        const session = await getSession({ req })

        if (!session) {
            return respondWithError({
                res: res,
                message: "Unauthorized",
                httpCode: 401
            })
        }

        return handler({ req, res, session })
    }
}

export default withProtect;
