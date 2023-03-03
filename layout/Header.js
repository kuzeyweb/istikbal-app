import { useEffect, useState } from "react";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header = () => {

    const [user, setUser] = useState();
    useEffect(() => {
        setUser(JSON.parse(localStorage["user"]));
    }, [])

    const logOut = () => {
        localStorage.removeItem("user");
        document.location.href = "/auth-login"
    };

    return (
        <div className="container-fluid sb1">
            <div className="row" style={{ background: "#171717" }}>
                {/*== LOGO ==*/}
                <div className="col-md-11 sb1-1" style={{ display: 'flex', justifyContent: 'space-between', color: "#fff", alignItems: 'center' }}>
                    <div className="left-side">
                        <a href="/"  ><img style={{ margin: '10px 0' }} width={200} src="https://www.erdemlievconcept.com/wp-content/uploads/2022/03/istikbal-w.png" alt="" />
                        </a>
                    </div>
                    <div className="right-side" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '5px' }}>Welcome <b>  {user?.fullname}</b></span>
                        <ExitToAppIcon onClick={() => logOut()} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
                <div className="col-md-2 col-sm-3 col-xs-6">
                </div>
            </div>
        </div>
    )
}

export default Header;