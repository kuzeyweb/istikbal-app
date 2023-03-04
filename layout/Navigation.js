import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';

const Navigation = () => {
    const router = useRouter();
    const [user, setUser] = useState();

    /*     function daysAfterDate(selectedDate) {
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            const result = [];
            for (let i = selectedDate.getDate() + 1; i <= daysInMonth; i++) {
              const day = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
              result.push(day);
            }
            return result;
          } */

    useLayoutEffect(() => {
        let userData;
        if (localStorage.getItem("user")) {
            userData = JSON.parse(localStorage["user"]);
            setUser(userData);
        }
    }, []);

    return (
        <div className="sb2-13">
            <ul className="collapsible" data-collapsible="accordion">
                <li><Link href="/" className={
                    router.pathname === "/" ? "active" : ""
                }> Anasayfa</Link>
                </li>
                <li><Link className={
                    router.pathname === "/payrolls" ? "active" : ""
                } href="/payrolls" > Bordrolar</Link>
                </li>
                <li style={{ width: '100%', padding: "12px 6px" }}><Link className={
                    router.pathname === "/tables" ? "active" : ""
                } href="/tables" > Tablolar</Link>
                </li>
                {user?.role_id === 1 &&
                    <li style={{ width: '100%', padding: "12px 6px" }}><Link className={
                        router.pathname === "/users" ? "active" : ""
                    } href="/users" > Çalışanlar</Link>
                    </li>
                }
            </ul>
        </div>
    )
}

export default Navigation;