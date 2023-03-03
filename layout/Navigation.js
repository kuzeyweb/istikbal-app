import Link from 'next/link';
import { Router, useRouter } from 'next/router';

const Navigation = () => {
    const router = useRouter();
    return (
        <div className="sb2-13">
            <ul className="collapsible" data-collapsible="accordion">
                <li><a className={
                    router.pathname === "/" ? "active" : ""
                } href="/" ><i className="fa fa-bar-chart" aria-hidden="true" /> Dashboard</a>
                </li>
                <li><Link className={
                    router.pathname === "/offers" ? "active" : ""
                } href="/offers" ><i className="fa-solid fa-file-invoice-dollar" /> Bionluk</Link>
                </li>

            </ul>
        </div>
    )
}

export default Navigation;