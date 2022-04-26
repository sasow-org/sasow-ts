import {Action} from "../util/actions/Action";
import {IDataDetailed} from "../util/data/interfaces/IDataDetailed";
import {IObservable} from "../util/datahandler/observer/IObservable";
import {RowData} from "../util/data/RowData";
import {AgentConfig} from "../util/config/AgentConfig";


export abstract class Agent implements IDataDetailed, IObservable{
    public static SHARED: number = -1
    public static NOREAD: number = 0
    public static READ: number = 1
    public static PREPARE_FOR_SHARE = 2

    protected _state: number
    protected _agent_id: number
    protected _followers: Agent[]
    protected _followings: Agent[]
    protected _actions: Action[]
    protected _isSeed: boolean
    protected _agentConfig: AgentConfig;

    protected constructor(id: number, state: number, isSeed: boolean, actions: Action[], agentConfig: AgentConfig) {
        this._state = state
        this._agent_id = id
        this._isSeed = isSeed
        this._actions = actions
        //Initialize lists
        this._followers = []
        this._followings = []
        //load config
        this._agentConfig = agentConfig;
    }

    public addFriend(agent: Agent): void {
        let exist: boolean = false

        if(agent._agent_id === this._agent_id){
            exist = true;
        }else {
            for(let i = 0; i<this._followers.length; i++){
                if(this._followers[i]._agent_id === agent._agent_id){
                    exist = true;
                    break;
                }
            }
        }

        if(!exist){
            this._followers.push(agent)
        }
    }

    public addFollowing(agent: Agent) : void {
        let exist: boolean = false

        if(agent._agent_id === this._agent_id){
            exist = true;
        }else {
            for(let i = 0; i<this._followings.length; i++){
                if(this._followings[i]._agent_id === agent._agent_id){
                    exist = true;
                    break;
                }
            }
        }

        if(!exist){
            this._followings.push(agent)
        }
    }

    public receiveMessage() : void {
        if(this.state === Agent.NOREAD) {
            const action : Action | undefined = this._actions.find(action => action.name === "read")
            if(this._state === Agent.READ && action){
                action.Execute(this);
                const action2 : Action | undefined = this._actions.find(action => action.name === "share");
                if(action2){
                    action2.Execute(this);
                }
            }
        }
    }

    get state(): number {
        return this._state;
    }

    set state(value: number) {
        this._state = value;
    }

    get agent_id(): number {
        return this._agent_id;
    }

    set agent_id(value: number) {
        this._agent_id = value;
    }

    get followers(): Agent[] {
        return this._followers;
    }

    set followers(value: Agent[]) {
        this._followers = value;
    }

    get followings(): Agent[] {
        return this._followings;
    }

    set followings(value: Agent[]) {
        this._followings = value;
    }

    get actions(): Action[] {
        return this._actions;
    }

    set actions(value: Action[]) {
        this._actions = value;
    }

    get isSeed(): boolean {
        return this._isSeed;
    }

    set isSeed(value: boolean) {
        this._isSeed = value;
    }

    get agentConfig() : AgentConfig {
        return this._agentConfig;
    }

    set agentConfig(agentConfig: AgentConfig) {
        this._agentConfig = agentConfig;
    }

    DataDetailed(): RowData {
        let rd : RowData = new RowData();
        rd.addRow(this._agent_id, "agent_id");
        rd.addRow(this._state, "agent_state");
        rd.addRow(this._isSeed, "agent_seed");
        rd.addRow(this._agentConfig.name, "agent_type");
        return rd;
    }

    notifyData(): void {
    }
}