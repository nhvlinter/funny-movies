import React, { FC, ReactNode, ReactElement, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

import { BasicLayout } from '../../layouts/BasicLayout';
import MaterialTable from "material-table";
import { Card, CardContent, CardHeader, Typography,Grid, OutlinedInput, Button } from "@material-ui/core";
import styles from "./SharePage.module.scss";
import { Movie } from "../../models/Movie";
export const SharePage: FC<{}> = observer(({}) => {
    const { routerStore, sFunny, currentUser } = useStore();
    if(!currentUser) routerStore.goTo("home");
    useEffect(() => {
        sFunny.initSharePage();
    }, []);
    const shareHandler = useCallback(()=>{
        if(currentUser){
            Movie.save(sFunny.sharedUrl,currentUser.id).then(()=>{
                routerStore.goTo("home");
            });    
        }
    },[])
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
    </BasicLayout>);
});




