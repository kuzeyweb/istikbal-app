import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Fullname", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up user from credentials supplied
                const user = await yourDatabaseLookupFunction(credentials.email, credentials.password)
                if (user) {
                    // Return user object if credentials are valid
                    return user
                } else {
                    // Return null if user could not be authenticated
                    return null
                }
            }
        }),
        // ...add more providers here
    ],
    session: {
        jwt: true,
        maxAge: 5 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async session(session, user) {
            // Add properties to session object
            session.user = user;
            return session;
        },
        async jwt(token, user) {
            // Add properties to token
            if (user) {
                token.user = user;
            }
            return token;
        },
    },
});