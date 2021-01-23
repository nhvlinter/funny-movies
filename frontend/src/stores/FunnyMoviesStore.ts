import { observable, action } from "mobx";
import { BaseStore } from "./BaseStore";
import { Movie } from "../models/Movie";
import { SharedView } from "../models/SharedView";
var getYoutubeTitle = require('get-youtube-title')
export class FunnyMoviesStore {
    @observable sharedUrl: string;
    @observable sharedList: SharedView[]=[];
    constructor(private store: BaseStore) {
        this.sharedUrl = "";
    }
    async initSharePage(){
        this.sharedUrl = "";
    }
    async initHomePage(userId:string|null){
        this.sharedList=[];
        const [err, data] = await SharedView.get(userId);
        if(!err && data){
            this.sharedList = data.map(d=>new SharedView(d));
        }
    }
    @action set_sharedUrl = ( v:string) => { this.sharedUrl = v;}
}