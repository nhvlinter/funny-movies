import { observable, action } from "mobx";
import { aFetch } from "../services/api/fetch";
import {storeJwtToken} from "./loginUtil";
import { Store } from "./Store";
import { User } from "../models/User";

export class LoginStore {
    constructor(private store:Store) {
    }

    @observable email     : string  = "";//"admin@gmail.com";
    @observable password  : string  = "";//"huflitxinchao";
    @observable rememberMe: boolean = true;

    @action set_email      = (v: string ) => { this.email      = v;/*this.store.set_temp_email(v);*/ }
    @action set_password   = (v: string ) => { this.password   = v; }
    @action set_rememberMe = (v: boolean) => { this.rememberMe = v; }

    @action async doLogin() {
        const [err, data] = await aFetch<{token:string}>("POST", "api/Login", {
            value: `${this.email};${this.password}`
        });
        if (!err && data) {
            storeJwtToken(data.token, this.rememberMe);
            location.href = this.signInRedirect;
        }
        else {
            //data = null mean password is incorrect.
            return new Error("Incorrect Password!");
        }

        return err;
    }

    signInRedirect      : string = "/";
}