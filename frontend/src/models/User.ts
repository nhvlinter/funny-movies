import { observable, action, toJS, computed } from "mobx";
export class User{
    @observable id: number;
    @observable email: string;
    @observable password: string;
    constructor(data?: any) {
        this.id = -1;
        this.email="";
        this.password="";
    }
}