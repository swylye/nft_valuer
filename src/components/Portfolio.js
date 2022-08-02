import React, { useState, useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



export default function Portfolio(props) {

    const [tableRows, setTableRows] = useState([])

    function createRow(address, count, price, holding) {
        return { address, count, price, holding }
    }

    function ccyFormat(num) {
        return `${Number(num).toFixed(6)}`;
    }

    function subtotal(items) {
        return items.map(({ holding }) => holding).reduce((sum, i) => sum + i, 0);
    }



    useEffect(() => {
        const data = props.data

        let sortedData = [...data];
        sortedData.sort((a, b) => {
            if (a.holding > b.holding) {
                return -1;
            }
            if (a.holding < b.holding) {
                return 1;
            }
            return 0;
        })

        const rows = sortedData.map(item => createRow(item.address, item.count, item.floorPrice, item.holding))
        setTableRows(rows)
    }, [props.data])


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell colSpan={1} sx={{ fontSize: "1.05rem", fontWeight: "bold" }}>Subtotal</TableCell>
                        <TableCell align="right" sx={{ fontSize: "1.05rem", fontWeight: "bold" }}>{ccyFormat(subtotal(tableRows))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Floor Price (ETH)</TableCell>
                        <TableCell align="right">Holdings (ETH)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableRows.map((row) => (
                        <TableRow key={row.address}>
                            <TableCell>{row.address}</TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{ccyFormat(row.holding)}</TableCell>
                        </TableRow>
                    ))}


                </TableBody>
            </Table>
        </TableContainer>
    );
}
