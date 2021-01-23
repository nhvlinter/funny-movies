import { observable, action, toJS, computed } from "mobx";
import { aFetch } from "../services/api/fetch";
export class SharedView{
    @observable MovieId: number;
    @observable Url: string;
    @observable Title: string;
    @observable Description: string;
    @observable SharedBy: string;
    @observable UpVote: number;
    @observable DownVote: number;
    @observable UserVote: string|null;
    constructor(data?: any) {
        this.MovieId = -1;
        this.Url="";
        this.Title="";
        this.Description="";
        this.SharedBy="";
        this.UpVote = 0;
        this.DownVote = 0;
        this.UserVote = null;
        if (data != null) {
            Object.assign(this, data);
        }
    }
    @action set_Title = ( v:string) => { this.Title = v;}
    @action set_Description = ( v:string) => { this.Description = v;}
    static async get(userId: string|null){
        const [err, data] = await aFetch<SharedView[]>("GET", `/api/Movie?uid=`+(userId ? userId : ""));
        return [err, err ? null : data.map(x=>new SharedView(x))] as const;
    }
    static async vote(movieId: number, currentUserId:number, isUpVote: boolean){
        const body = {
            MovieId : movieId,
            UserId : currentUserId,
            IsUpVote: isUpVote ? 1 : 0
        };
        const [err, x] = await aFetch<{}>("POST", `/api/Vote`, body);
        return [err, null] as const;
    }
    @computed get descriptionOutput(){
        const maxTextLength = 350;
        return (this.Description && this.Description.length > maxTextLength) ? (this.Description.substr(0, maxTextLength) + "...") : this.Description;
    }
    @computed get voteStatus(){
        if(this.UserVote){
            if(this.UserVote == "1"){
                return "(voted up)";
            }
            return "(voted down)";
        }
        return "(un-voted)";
    }
}