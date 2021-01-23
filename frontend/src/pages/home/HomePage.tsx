import React, { FC, ReactNode, ReactElement, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

import { BasicLayout } from '../../layouts/BasicLayout';
import { SharedView } from '../../models/SharedView';
import YouTube from 'react-youtube';
import {Grid, IconButton, CircularProgress, Backdrop} from '@material-ui/core';
import styles from "./HomePage.module.scss";
import {ThumbDownOutlined, ThumbUpOutlined, ThumbDown, ThumbUp} from "@material-ui/icons";

export const HomePage: FC<{}> = observer(({}) => {
    const { routerStore, sFunny, currentUser } = useStore();
    useEffect(() => {
        sFunny.initHomePage(currentUser ? currentUser.id.toString() : null);
    }, []);
    const vote = useCallback((movieId:number, isUpVote:boolean)=>{
        if(!currentUser) return;
        SharedView.vote(movieId,currentUser.id,isUpVote).then(()=>{
            for(var i=0;i<sFunny.sharedList.length;i++){
                if(sFunny.sharedList[i].MovieId == movieId){
                    if(isUpVote){
                        sFunny.sharedList[i].UpVote +=1;
                        sFunny.sharedList[i].UserVote = "1";
                    }
                    else{
                        sFunny.sharedList[i].DownVote +=1;
                        sFunny.sharedList[i].UserVote = "0";    
                    }
                    break;
                }
            }
        })
    },[]);
    return (<BasicLayout>
        <div className={styles.root}>
        {(sFunny.sharedList && sFunny.sharedList.length > 0) ? sFunny.sharedList.map(s => (<Grid container 
            className={styles.row}
            spacing={3}
            justify="center">
            <Grid item xs={5}>
                    <YouTube 
                    containerClassName = {styles.youtubeWrapper}
                    className={styles.youtube} videoId={s.Url}/>
            </Grid>
            <Grid item xs={5}>
                <div className={styles.title}>{s.Title}</div>
                <div>
                <Grid container>
                    <Grid item xs={7}>
                        Shared by: {s.SharedBy}
                    </Grid>
                    {currentUser && (<Grid item xs={5}>
                        {s.UserVote 
                            ? s.UserVote == "1" ? (<ThumbUp className={styles.iconVote} />) : (<ThumbDown className={styles.iconVote} />)
                            : (<>
                                <IconButton onClick={()=>vote(s.MovieId,true)}><ThumbUpOutlined /></IconButton>
                                <IconButton onClick={()=>vote(s.MovieId,false)}><ThumbDownOutlined /></IconButton>
                            </>)}
                        {s.voteStatus}
                    </Grid>)}
                </Grid>
                </div>
                <div>
                    {s.UpVote} <ThumbUpOutlined className={styles.icon}/>   
                    {s.DownVote} <ThumbDownOutlined className={styles.icon}/>
                </div>
                <div>Description:</div>
                <div>{s.descriptionOutput}</div>
            </Grid>
        </Grid>)): (<Backdrop className={styles.backdrop} open={true}>
                <CircularProgress color="primary" />
            </Backdrop>)}
        </div>
    </BasicLayout>);
});




