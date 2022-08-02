import React from "react"
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';


export default function Start(props) {
    return (
        <section className="start">
            <Typography variant="h3" style={{ fontWeight: "bolder" }}>Find out the value of your NFT portfolio!</Typography>
            <Input
                autoFocus={true}
                type="text"
                placeholder="Enter your ETH address.."
                value={props.value}
                onChange={(e) => props.handleChange(e.target.value)}
                style={{ width: 400, padding: 5 }}
            />
            <Button
                variant="contained"
                className="start-btn"
                onClick={props.handleClick}
            >
                Submit
            </Button>
        </section>
    )
}
