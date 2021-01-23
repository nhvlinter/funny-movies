import { observable, action, runInAction } from "mobx";

import { aFetch, setAuthtoken } from "../services/api/fetch";

import { User } from "../models/User";

import { BaseStore } from "./BaseStore";

import { UserRoleKey } from "../config";
import { getJwtToken, clearJwtToken, storeJwtToken, isPersistent } from "./loginUtil";

export class AuthorizedStore extends BaseStore {
    @observable.ref currentUser?: User;

    // async setLocale (v:string) {
    //     const err = await super.setLocale(v);
    //     if (!err && this.currentUser && this.currentUser.language != v) {
    //         this.currentUser.set_language(v);
    //         this.currentUser.updateProfile().then((err) => {
    //             if (err) console.error(err);
    //         })
    //     }
    //     return err;
    // };

    async checkLogin() {
        if (this.currentUser != null) return true;
        const authToken = getJwtToken();
        if (!authToken) return false;
        const [err] = await this.setToken(authToken);
        return err == null;
    }

    async setToken(token: string) {
        setAuthtoken(token);
        document.cookie = "jwt=" + token + ";path=/;";
        const [err, data] = await aFetch("GET", "/api/Login?token="+token);
        if (err) {
            setAuthtoken("");
            clearJwtToken();
            this.deleteJwtCookie();
            return [err, data] as const;
        }
        // var tempUser = new User();
        // tempUser.userId = 1;
        // tempUser.set_email("admin@huflit.edu.vn");
        // tempUser.firstName = "Admin";
        // tempUser.lastName = "System";
        // tempUser.role = EUserRole.Admin;
        // var err = undefined;
        // var data = tempUser.toJS();
        this.currentUser = new User();
        this.currentUser.email = data.Email;
        this.currentUser.id = data.Id;
        // storeJwtToken(token, false);
        //Load isPaperBy and InchargedByj

        // runInAction(() => {
        //     if (!!data.language && this.locales.includes(data.language)) {
        //         super.setLocale(data.language);
        //     } else {
        //         this.refreshLocales().then(() => {
        //             if (!!data.language && this.locales.includes(data.language)) {
        //                 super.setLocale(data.language);
        //             }
        //         });
        //     }
        // });

        return [err, data] as const;
    }

    @action logout = async () => {
        this.currentUser = undefined;
        setAuthtoken("");
        clearJwtToken();
        this.deleteJwtCookie();
        location.assign("/");
        sessionStorage.clear();
        localStorage.clear();
    }

    deleteJwtCookie() {
        document.cookie = "jwt=expired;path=/;";
    }
}
