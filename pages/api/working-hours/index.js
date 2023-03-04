import { respondWithError, respondWithSuccess } from "../../../helpers/apiResponse";
import { prisma } from "../../../prisma/client";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from "moment";

const extractPdf = (data) => {
    const doc = new jsPDF();

    const headers = [
        "Beginn",
        "Pause",
        "Ende",
        "Dauer",
        "Kategorie",
        "Erfasst am",
        "Bemerkungen"
    ];

    const rows = data.map((obj) => Object.values(obj));

    const formattedData = rows.map((row, username) => {
        return row.map((cell, index) => {
            if (moment(cell, moment.ISO_8601, true).isValid()) {
                if (index === 8 || index === 9)
                    return cell; // skip fullname and date_range
                else if (index === 5)
                    return moment(cell).format('DD MMMM YYYY');
                else
                    return moment(cell).format('HH:mm');
            } else {
                return cell;
            }
        });
    });

    doc.autoTable({
        head: [headers],
        body: formattedData,
        startY: 20,
        margin: { top: 20 },
    });

    doc.setFontSize(10);
    doc.text(`Vollständiger Name: ${data?.[0]?.user_name}\nDatumsbereich: ${data?.[0]?.date_range}`, 10, 10);

    const fileName = `public/uploads/${new Date().getTime() + "_" + data?.[0]?.user_name}.pdf`;
    doc.save(fileName);
    return fileName;
}

async function handler(req, res) {
    const { method } = req;
    if (method === "POST") {
        try {
            const pdf_url = extractPdf(req.body.data);

            const hours = await prisma.working_hours_records.createMany({
                data: [
                    ...req.body.data.map((item) => { delete item.user_name; item.pdf_url = pdf_url; return item; }),
                ]
            });

            return respondWithSuccess({ res: res, message: "Working hours successfully posted", payload: { working_hours: hours } });

        } catch (err) {
            console.error(err)
            return respondWithError({ res: res, message: err.message, httpCode: 500 })
        }
    } else if (method === "GET") {
        const { user_id } = req.query;
        try {
            const hours = await prisma.working_hours_records.findMany({
                where: {
                    user_id
                },
                include: {
                    user: true
                }
            });
            return respondWithSuccess({ res: res, message: "Working hours successfully listed", payload: { working_hours: hours } })
        } catch (err) {
            console.error(err);
        }
    } else {
        return respondWithError({ res: res, message: "Method not allowed", httpCode: 405 })
    }
};

export default handler;