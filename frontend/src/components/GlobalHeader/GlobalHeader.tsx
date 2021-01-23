import React, {useCallback} from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from "../../stores";

import { Toolbar, IconButton, Typography, Badge, InputBase, Button, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import {Menu, Notifications, AccountCircle, Home, Search} from "@material-ui/icons";

import styles from "./GlobalHeader.module.scss";

import classNames from 'classnames';

export const GlobalHeader = observer(() => {
    const {currentUser, routerStore, sLogin, logout} = useStore();
    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState("");
    const login = useCallback(()=>{
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(String(sLogin.email).toLowerCase())){
        setErrMsg("Invalid Email!");
        setOpen(true);
        return;
      }
      sLogin.doLogin().then((err)=>{
        if(err){
          setErrMsg(err.message);
          setOpen(true);
          return;  
        }
      });
    },[]);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    };
    return (
    	<Toolbar className={styles.toolbar}>
            <Home />
          <Typography variant="h6" color="inherit" className={styles.title}>
             Funny Movies
          </Typography>
          {currentUser 
              ? (<>
                  <Typography>Welcome {currentUser.email}</Typography>
                  <Button variant="contained" color="secondary" onClick={()=>routerStore.goTo("share")}>Share a movie</Button>
                  <Button variant="contained" onClick={()=>logout()}>Logout</Button>
                  </>)
              :(<>
                  <div className={styles.inputLogin}>
                      <InputBase
                      value={sLogin.email}
                      onChange={(e)=>sLogin.set_email(e.target.value)}
                      placeholder="Email"
                      inputProps={{ 'aria-label': 'email' }}
                      />    
                  </div>
                  <div className={styles.inputLogin}>
                      <InputBase
                      value={sLogin.password}
                      onChange={(e)=>sLogin.set_password(e.target.value)}
                      placeholder="Password"
                      inputProps={{ 'type':'password', 'aria-label': 'password' }}
                      />
                  </div>
                  <Button variant="contained" onClick={()=>login()}>Register/Login</Button>
                  </>)}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
            {errMsg}
          </MuiAlert>
        </Snackbar>
        </Toolbar>
    );
});




