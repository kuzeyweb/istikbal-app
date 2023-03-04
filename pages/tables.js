import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../layout/Header'
import Navigation from '../layout/Navigation'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import DataTable from 'react-data-table-component';

const columns = [
    {
        name: 'İsim',
        selector: row => row.fullname,
        sortable: true
    },
    {
        name: 'Tarih Aralığı',
        selector: row => row.date_range,
        sortable: true
    },
    {
        name: 'Not',
        selector: row => row.note,
        sortable: true
    },
    {
        name: 'Tablo',
        selector: row => <a target="_blank" href={row.pdf_url}>Tabloyu Görüntüle</a>
    }
];


const Tables = () => {

    const router = useRouter();

    const [user, setUser] = useState();
    const [formData, setFormData] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [alert, setAlert] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [remainingDays, setRemainingDays] = useState([]);
    const [dateRange, setDateRange] = useState();
    const [data, setData] = useState([]);

    useLayoutEffect(() => {
        let userData;
        if (localStorage.getItem("user")) {
            userData = JSON.parse(localStorage["user"]);
            setUser(userData);
        }
        if (!userData)
            router.replace("/auth-login");
    }, []);

    useEffect(() => {
        if (user && !data.length > 0)
            loadData();
    }, [user])

    const loadData = async () => {
        try {
            let res;
            if (user.role_id === 1) {
                res = await axios.get("/api/working-hours");
            } else {
                res = await axios.get(`/api/working-hours?user_id=${user.id}`);
            }
            const result = Object.values(res.data.payload.working_hours.reduce((acc, curr) => {
                const key = `${curr.date_range}-${curr.user.id}`; // include user_id in key
                if (!acc[key]) {
                    acc[key] = { date_range: curr.date_range, records: [curr], fullname: curr.user.fullname, note: curr.note, id: curr.id, pdf_url: curr.pdf_url };
                } else {
                    acc[key].records.push(curr);
                }
                return acc;
            }, {}));

            setData(result);
        } catch (err) {
            console.error(err)
        }
    };

    function decimalHoursToTime(decimalHours) {
        const wholeHours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - wholeHours) * 60);
        return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
    }

    const handleSubmit = async () => {
        try {
            await axios.post("api/working-hours", {
                data: formData.map((item) => ({
                    ...item,
                    user_id: user.id,
                    date_range: dateRange,
                    user_name: user.fullname
                }))
            });
            setAlert({ type: "success", message: "Tablo başarıyla oluşturuldu" });
        } catch (err) {
            console.error(err)
            setAlert({ type: "error", message: "Bir hata oluştu" });
        }
    };

    function getRemainingDaysOfMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const remainingDates = [];

        for (let i = date.getDate(); i <= lastDayOfMonth; i++) {
            const day = new Date(Date.UTC(year, month, i));
            remainingDates.push(day);
        }

        return remainingDates;
    }

    useEffect(() => {
        const days = getRemainingDaysOfMonth(startDate);
        setRemainingDays(days);
        setDateRange(moment.utc(days[0]).format("DD MMM, yyyy") + " - " + moment.utc(days[days.length - 1]).format("DD MMM, yyyy"))
    }, [startDate]);


    function calculateWorkTime(start_time, end_time, break_time) {
        const start = moment(start_time, 'HH:mm');
        const end = moment(end_time, 'HH:mm');
        let durationInMs;

        if (moment.isDuration(break_time)) {
            const pause = break_time;
            durationInMs = end.diff(start) - pause.asMilliseconds();
        } else {
            const pauseStart = moment(break_time[0], 'HH:mm');
            const pauseEnd = moment(break_time[1], 'HH:mm');
            const pauseDurationInMs = pauseEnd.diff(pauseStart);
            durationInMs = end.diff(start) - pauseDurationInMs;
        }

        const durationInHours = moment.duration(durationInMs).asHours();
        return parseFloat(durationInHours.toFixed(2));
    }

    // todo:hesaplama güncellenecek
    const calculateTimeDiff = (end_time, start_time, break_time, index) => {
        if (end_time && start_time && break_time) {
            const totalTime = calculateWorkTime(start_time, end_time, moment.duration(break_time.getHours() + ":" + break_time.getMinutes()));

            setFormData(current => {
                const updatedCurrent = [...current];
                updatedCurrent[index] = { ...updatedCurrent[index], total_time: decimalHoursToTime(totalTime) };
                return updatedCurrent;
            });
        }
    };

    return (
        <>
            <Head>
                <title>Muhasebe App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <Header />
                {/*== BODY CONTNAINER ==*/}
                <div className="container-fluid">
                    <div className="row">
                        <div className="sb2-1">
                            {/*== USER INFO ==*/}
                            <div className="sb2-12" style={{ background: "#171717", color: "#fff" }}>
                                <ul>
                                    <li>
                                        <Navigation />
                                    </li>
                                    <li />
                                </ul>
                            </div>
                        </div>
                        <div className="sb2-2">
                            <div className="form-content" style={{ background: "none" }}>
                                <div key={activeTab} className="form-items">
                                    <div className="page-links">
                                        <a href='#' onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>Tablolar</a>
                                        <a href="#" onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>Tablo Girişi</a>

                                    </div>
                                </div>
                            </div>
                            {alert &&
                                alert?.type === "success" ?
                                <div className="alert alert-success" role="alert">
                                    {alert?.message}
                                </div> :
                                alert?.type === "error" ?
                                    <div className="alert alert-danger" role="alert">
                                        {alert?.message}
                                    </div> : null
                            }
                            {activeTab === 2 &&
                                <>
                                    <div style={{ width: '15%' }}>
                                        <b>Datum</b>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="dd.MM.yyyy"
                                        />
                                    </div>
                                    <table style={{ background: '#fff' }} className="table">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Datum</th>
                                                <th scope="col">Beginn</th>
                                                <th scope="col">Pause</th>
                                                <th scope="col">Ende</th>
                                                <th scope="col">Dauer</th>
                                                <th scope="col">Kategorie</th>
                                                <th scope="col">Erfasst am</th>
                                                <th scope="col">Bemerkungen</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {remainingDays.length > 0 && remainingDays.map((item, index) =>
                                                <tr key={index}>
                                                    <td>
                                                        {moment.utc(item).format("DD MMM")}
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            selected={formData?.[index]?.start_time ?? ""}
                                                            onChange={(date) => {
                                                                calculateTimeDiff(formData?.[index]?.end_time, date, formData?.[index]?.break_time, index)
                                                                setFormData(current => {
                                                                    const updatedCurrent = [...current];
                                                                    updatedCurrent[index] = { ...updatedCurrent[index], start_time: date };
                                                                    return updatedCurrent;
                                                                })
                                                            }}
                                                            showTimeSelectOnly
                                                            showTimeInput
                                                            timeCaption="Time"
                                                            dateFormat="HH:mm"
                                                        />
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            selected={formData?.[index]?.break_time ?? ""}
                                                            onChange={(date) => {
                                                                setFormData(current => {
                                                                    const updatedCurrent = [...current];
                                                                    updatedCurrent[index] = { ...updatedCurrent[index], break_time: date };
                                                                    return updatedCurrent;
                                                                })
                                                                calculateTimeDiff(formData?.[index]?.end_time, formData?.[index]?.start_time, date, index)
                                                            }}
                                                            showTimeSelectOnly
                                                            showTimeInput
                                                            timeCaption="Time"
                                                            dateFormat="HH:mm"
                                                        />
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            selected={formData?.[index]?.end_time ?? ""}
                                                            onChange={(date) => {
                                                                calculateTimeDiff(date, formData?.[index]?.start_time, formData?.[index]?.break_time, index)
                                                                setFormData(current => {
                                                                    const updatedCurrent = [...current];
                                                                    updatedCurrent[index] = { ...updatedCurrent[index], end_time: date };
                                                                    return updatedCurrent;
                                                                })
                                                            }}
                                                            showTimeSelectOnly
                                                            showTimeInput
                                                            timeCaption="Time"
                                                            dateFormat="HH:mm"
                                                        />
                                                    </td>
                                                    <td key={formData?.[index]} className='h4'>{
                                                        formData?.[index]?.total_time ?? "-"}</td>
                                                    <td>
                                                        <input
                                                            onChange={(e) => setFormData(current => {
                                                                const updatedCurrent = [...current];
                                                                updatedCurrent[index] = { ...updatedCurrent[index], worker_status: e.target.value };
                                                                return updatedCurrent;
                                                            })}
                                                            type="text" />
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            selected={formData?.[index]?.date_selected ?? ""}
                                                            onChange={(date) => setFormData(current => {
                                                                const updatedCurrent = [...current];
                                                                updatedCurrent[index] = { ...updatedCurrent[index], date_selected: date };
                                                                return updatedCurrent;
                                                            })}
                                                            dateFormat="dd.MM.yyyy" />
                                                    </td>
                                                    <td><input
                                                        onChange={(e) => setFormData(current => {
                                                            const updatedCurrent = [...current];
                                                            updatedCurrent[index] = { ...updatedCurrent[index], note: e.target.value };
                                                            return updatedCurrent;
                                                        })}
                                                        type="text" /></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <button onClick={() => handleSubmit()} style={{ background: "#171717" }} className='btn btn-primary'>Onayla ve Gönder</button>
                                </>
                            }
                            {activeTab === 1 &&
                                <DataTable
                                    highlightOnHover
                                    columns={columns}
                                    data={data}
                                    pagination
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tables;
