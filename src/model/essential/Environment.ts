import { Agent } from './Agent';
import { IObservable } from '../util/datahandler/observer/IObservable';
import { IDataEssential } from '../util/data/interfaces/IDataEssential';
import { IDataDetailed } from '../util/data/interfaces/IDataDetailed';
import { RowData } from '../util/data/RowData';
import { AgentConfig } from '../util/config/AgentConfig';
import { DataHandler } from '../util/datahandler/DataHandler';
import { FactoryDynamicClass } from '../util/factory/FactoryDynamicClass';

export abstract class Environment implements IObservable, IDataEssential, IDataDetailed {
  protected _id: number;

  protected _networkSize: number;

  protected _seedSize: number;

  protected _periods: number;

  protected _period: number;

  protected _initialized: boolean;

  protected _users: Agent[];

  protected _usersQuantity: number;

  protected _seeds: Agent[];

  protected _agentsConfigs: AgentConfig[];

  protected constructor(
    id: number,
    periods: number,
    NetworkSize: number,
    SeedSize: number,
    agentsConfigs: AgentConfig[],
  ) {
    this._id = id;
    this._periods = periods;
    this._networkSize = NetworkSize;
    this._seedSize = SeedSize;

    this._initialized = false;
    this._usersQuantity = 0;
    this._users = [];
    this._seeds = [];
    this._agentsConfigs = agentsConfigs;
  }

  public abstract step() : void;
  public abstract run() : void;
  public abstract getCountStates(): RowData;

  DataEssential(): RowData {
    const rdEnvironment : RowData = new RowData();
    rdEnvironment.addRow(this._period, 'simulation_period');
    rdEnvironment.addRows(this.getCountStates());
    return rdEnvironment;
  }

  DataDetailed(): RowData {
    const rdEnvironment : RowData = new RowData();
    rdEnvironment.addRow(this._period, 'simulation_period');
    return rdEnvironment;
  }

  notifyData(): void {
    DataHandler.getInstance().update();
  }

  public initialize() : void {
    this._agentsConfigs.forEach((agentConfig: AgentConfig) => {
      this.createAgents(agentConfig);
    });

    this.addFollowers();
    this.addFollowings();

    if (!this.isDone()) {
      console.log('Error in initialize environment with id: ', this._id);
      console.log('ERROR ERROR ERROR ERROR ERROR ERROR');
      console.log('ERROR ERROR ERROR ERROR ERROR ERROR');
      console.log('ERROR ERROR ERROR ERROR ERROR ERROR');
      console.log('ERROR ERROR ERROR ERROR ERROR ERROR');
    }

    this._initialized = true;
  }

  public addFollowers(): void {
    console.log('Starting add Followers');
    this.users.map((user: Agent) => {
      const { agentConfig } = user;
      const total : number = agentConfig.getQuantityFollowersByNetwork(this._networkSize);
      while (user.followers.length !== total) {
        const max: number = this.users.length;
        const randomIndex : number = Number.parseInt(`${Math.random() * ((max - 1) + 1)}${0}`, 10);
        user.addFriend(this.users[randomIndex]);// todo maybe the addFriend function can call addFollower.,,
      }
    });
    console.log('End adding Followers');
  }

  public addFollowings() : void {
    console.log('Starting add Followings.');
    this.users.map((user: Agent) => {
      const { agentConfig } = user;
      const total : number = agentConfig.getQuantityFollowingsByNetwork(this._networkSize);
      // console.log("Total in Followings: "+total);
      // console.log("FollowingsSize: "+user.followings.length+ "i --> "+i)
      while (user.followings.length !== total) {
        const max: number = this.users.length;
        const randomIndex : number = Number.parseInt(`${Math.random() * ((max - 1) + 1)}${0}`, 10);
        user.addFollowing(this.users[randomIndex]);// todo maybe the addFriend function can call addFollower.,,
      }
    });
    console.log('End adding Followers');
  }

  public createAgents(agentConfig: AgentConfig) : void {
    // agentConfig
    // Por la cantidad de agentes que hay en ese agent,
    console.log(`Starting create agents with AgentConfig: ${agentConfig.nameConfig}`);
    console.log('AgentConfig in CreateAgents: ', agentConfig);
    for (let i = 0; i < agentConfig.quantityAgent; i++) {
      const agentReference = FactoryDynamicClass.getInstance().getAgent(agentConfig.agentType);
      // eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line new-cap
      const auxAgent = new agentReference(i, agentConfig);
      this.users.push(auxAgent);
      if (auxAgent.isSeed) {
        this.seeds.push(auxAgent);
      }
      ++this.usersQuantity;
    }
    console.log('End create agents.');
  }

  public isDone() : boolean {
    // todo make isDone

    if (this.users.length !== this._networkSize) {
      console.log('Network Size esta bug...');
      return false;
    }

    if (this.seeds.length !== this._seedSize) {
      return false;
    }

    // eslint-disable-next-line consistent-return
    this.users.map((agent: Agent) => {
      if (agent.followers.length !== agent.agentConfig.getQuantityFollowersByNetwork(this._networkSize) && agent.followings.length !== agent.agentConfig.getQuantityFollowingsByNetwork(this._networkSize)) {
        console.log('Error en la cantidad de seguidores o seguidos del usuario.');
        return false;
      }
    });

    console.log('ALL DONE !!!!!!!!!!');
    return true;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get networkSize(): number {
    return this._networkSize;
  }

  set networkSize(value: number) {
    this._networkSize = value;
  }

  get seedSize(): number {
    return this._seedSize;
  }

  set seedSize(value: number) {
    this._seedSize = value;
  }

  get periods(): number {
    return this._periods;
  }

  set periods(value: number) {
    this._periods = value;
  }

  get period(): number {
    this.notifyData();
    return this._period;
  }

  set period(value: number) {
    this._period = value;
    this.notifyData();
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(value: boolean) {
    this._initialized = value;
  }

  get users(): Agent[] {
    return this._users;
  }

  set users(value: Agent[]) {
    this._users = value;
  }

  get usersQuantity(): number {
    return this._usersQuantity;
  }

  set usersQuantity(value: number) {
    this._usersQuantity = value;
  }

  get seeds(): Agent[] {
    return this._seeds;
  }

  set seeds(value: Agent[]) {
    this._seeds = value;
  }
}
