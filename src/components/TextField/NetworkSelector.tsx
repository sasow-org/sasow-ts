import * as React from "react";
import {TextField} from "@mui/material";
import {useContext, useState} from "react";
import {ExperimentConfigContext} from "../../App";

const networkOptions = [
    {
        value: "TwitterConfig",
        label: "Twitter"
    },
    {
        value: "FacebookConfig",
        label: "Facebook"
    }
]

export default function NetworkSelector() {


    const experimentConfig= useContext(ExperimentConfigContext);

    const [network, setNetwork] = useState(experimentConfig.experimentType)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNetwork(event.target.value)
        experimentConfig.experimentType = event.target.value
    }

    return(
        <TextField
            id="outlined-select-currency-native"
            select
            label="Network to Simulate"
            value={network}
            onChange={handleChange}
            SelectProps={{
                native: true,
            }}
            helperText="Please select your Network"
            variant="filled"
            fullWidth
        >
            {networkOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </TextField>
    )
}