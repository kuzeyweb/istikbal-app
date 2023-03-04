import { respondWithError, respondWithSuccess } from "../../../helpers/apiResponse";
import { prisma } from "../../../prisma/client";

async function handler(req, res) {
    const { method } = req;
    if (method === "POST") {
        const { user_id, url, date } = req.body;

        if (!user_id || !url)
            return respondWithError({ res: res, message: "user_id, date and url fields are required", httpCode: 400 });

        try {
            const payroll = await prisma.payrolls.create({
                data: {
                    user_id: Number(user_id),
                    date: date,
                    url: url
                }
            });

            return respondWithSuccess({ res: res, message: "Payroll successfully posted", payload: { payroll: payroll } })

        } catch (err) {
            return respondWithError({ res: res, message: err.message, httpCode: 500 })
        }
    } else if (method === "GET") {
        const { user_id } = req.query;
        if (user_id) {
            try {
                const payrolls = await prisma.payrolls.findMany({
                    where: {
                        user_id: Number(user_id)
                    },
                    include: {
                        user: true
                    }
                });
                return respondWithSuccess({ res: res, message: "Payrolls successfully listed", payload: { payrolls: payrolls } })
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const payrolls = await prisma.payrolls.findMany({
                    include: {
                        user: true
                    }
                });
                return respondWithSuccess({ res: res, message: "Payrolls successfully listed", payload: { payrolls: payrolls } })
            } catch (err) {
                console.error(err);

            }
        }
    } else {
        return respondWithError({ res: res, message: "Method not allowed", httpCode: 405 })
    }
};

export default handler;