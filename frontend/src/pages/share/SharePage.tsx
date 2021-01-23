import React, { FC, ReactNode, ReactElement, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

import { BasicLayout } from '../../layouts/BasicLayout';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Card, CardContent, CardHeader, Typography,Grid, OutlinedInput, Button, Snackbar } from "@material-ui/core";
import styles from "./SharePage.module.scss";
import { Movie } from "../../models/Movie";
export const SharePage: FC<{}> = observer(({}) => {
    const { routerStore, sFunny, currentUser } = useStore();
    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState("");
    if(!currentUser) routerStore.goTo("home");
    useEffect(() => {
        sFunny.initSharePage();
    }, []);
    const shareHandler = useCallback(()=>{
        if(currentUser){
            Movie.save(sFunny.sharedUrl,currentUser.id).then(([err, data])=>{
                if(err){
                    setErrMsg(err.message);
                    setOpen(true);
                    return;
                }
                routerStore.goTo("home");
            });    
        }
    },[]);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    };
    return (<BasicLayout>
        <div style={{ display:'flex', justifyContent:'center' }}>
        <Card variant="outlined" style={{width:400, }}>
        <CardHeader title="Share a Youtube movie" />
        <CardContent>
            <Grid container spacing={3} alignItems="center" style={{paddingBottom:20}}>
                <Grid item sm={4} xs={12}>
                    <label>Youtube URL:</label>
                </Grid>
                <Grid item sm={8} xs={12}>
                    <OutlinedInput 
                    value={sFunny.sharedUrl}
                    onChange={(e)=>sFunny.set_sharedUrl(e.target.value)}
                    inputProps={{ 'type':'text'}} />
                </Grid>
            </Grid>
            <Grid container spacing={3} justify="center">
                <Button variant="contained"
                        color="default"
                        onClick={shareHandler}
                    >Share</Button>
            </Grid>
        </CardContent>
        </Card></div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
            {errMsg}
          </MuiAlert>
        </Snackbar>
    </BasicLayout>);
});




