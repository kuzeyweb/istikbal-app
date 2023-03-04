import axios from 'axios';
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';

export default function AuthLogin() {
    const [formData, setFormData] = useState({
        fullname: null,
        password: null
    });
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const router = useRouter();

    useLayoutEffect(() => {
        let user = localStorage["user"];
        if (user)
            router.replace("/")
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { fullname, password } = formData;
        if (!fullname || !password) return;
        try {
            const res = await axios.post("api/auth/login", formData);
            localStorage.setItem("user", JSON.stringify(res.data.payload.user));
            setErrorMessage(false);
            setSuccessMessage(true);
            setTimeout(() => {
                router.replace("/");
            }, 1500);
        } catch (err) {
            setErrorMessage(true);
            console.error(err)
        }
    };

    return (
        <div className="form-body">
            <div className="row">
                <div className="img-holder">
                    <div className="bg" />
                    <div className="info-holder">
                        <img width={250} src="https://www.erdemlievconcept.com/wp-content/uploads/2022/03/istikbal-w.png" alt="" />
                    </div>
                </div>
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items">
                            <div className="page-links">
                                <a className="active">Login</a>
                            </div>
                            {errorMessage && <div className="alert alert-danger" role="alert">
                                Could not login with the given credentials
                            </div>}
                            {successMessage && <div className="alert alert-success" role="alert">
                                You are successfully logged in
                            </div>}
                            <form onSubmit={(event) => handleSubmit(event)}>
                                <input onChange={(e) => setFormData(current => ({ ...current, fullname: e.target.value }))} className="form-control" type="text" name="username" placeholder="Username" required />
                                <input onChange={(e) => setFormData(current => ({ ...current, password: e.target.value }))} className="form-control" type="password" name="password" placeholder="Password" required />
                                <div className="form-button">
                                    <button onClick={(e) => handleSubmit(e)} className="ibtn">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}