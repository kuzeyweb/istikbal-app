import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';

const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const router = useRouter();

        useLayoutEffect(() => {
            const user = localStorage["user"];
            if (!user)
                router.replace("/auth-login");
        })
    }

    return Wrapper
}

export default withAuth