import { observable, action, toJS, computed } from "mobx";
export class Vote{
    @observable userId: number;
    @observable movieId: number;
    @observable isUpVote: boolean|null;
    constructor(data?: any) {
        this.userId = -1;
        this.movieId=-1;
        this.isUpVote = null;
    }
}