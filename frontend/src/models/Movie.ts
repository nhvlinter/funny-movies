import { observable, action, toJS, computed } from "mobx";
import { aFetch } from "../services/api/fetch";
export class Movie{
    @observable id: number;
    @observable url: string;
    @observable title: string;
    @observable description: string;
    @observable sharedBy: number;
    constructor(data?: any) {
        this.id = -1;
        this.url="";
        this.title="";
        this.description="";
        this.sharedBy=-1;
    }
    static async save(url:string, currentUserId:number){
        const body = {
            url : url,
            sharedBy : currentUserId
        };
        const [err, data] = await aFetch<{}>("POST", `/api/Movie`, body);
        if(data && data["error"]){
            return [new Error(data["error"]), null] as const;
        }
        return [err, null] as const;
    }
}