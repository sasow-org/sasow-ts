import { Card, FormControlLabel, Grid, Switch} from "@mui/material";
import React, {useContext} from "react";
import {ExperimentConfigContext} from "../../../App";
import Typography from "@mui/material/Typography";

export default function DataHandlerOptionsCard() {

    const experimentConfig= useContext(ExperimentConfigContext);

    const [checkedEssential, setCheckedEssential] = React.useState(experimentConfig.essentialData);

    const [checkedDetailed, setCheckedDetailed] = React.useState(experimentConfig.detailedData)

    const handleDetailedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedDetailed(event.target.checked);
        experimentConfig.detailedData = event.target.checked;
    };


    return <Card>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant={'h5'}>
                    DataHandler Configurator
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel control={<Switch checked={checkedEssential} />} label="Essential Data" />
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel control={<Switch checked={checkedDetailed}  onChange={handleDetailedChange}/>} label="Detailed Data" />
            </Grid>
        </Grid>
    </Card>
}