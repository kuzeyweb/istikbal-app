import { withIronSession } from "next-iron-session";

export default withIronSession(
    async (req, res) => {
        // Initialize session with default properties
        req.session.init = true;

        return {
            props: {},
        };
    },
    {
        cookieName: "my-session-cookie",
        password: process.env.COOKIE_SECRET,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    }
);