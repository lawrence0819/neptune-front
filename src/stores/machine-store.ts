import * as _ from 'lodash';
import * as Reflux from 'reflux';
import api from '../api/machine-api';
import { Request, Response } from 'superagent';
import { MachineActions } from '../actions/machine-action';

export interface MachineModel {
  name: string,
  active: boolean,
  driver: string,
  state: string,
  url: string,
  swarm?: string
}

export const MachineIndexedStore = Reflux.createStore({
  listenables: MachineActions,
  init: function() {
    this.machines = {};
  },
  getInitialState: function() {
    return this.machines;
  },
  onLoadCompleted: function (res:Response) {
    this.machines = {};
    res.body.forEach(machine => this.machines[machine.name] = machine);
    this.trigger(this.machines);
  },
  onCreateCompleted: function(res:Response) {
    let name = res.body.Driver.MachineName;
    this.machines[name] = res.body;
    this.trigger(this.machines);
  }
});

export const MachineNameOperatingStore = Reflux.createStore({
  listenables: MachineActions,
  init: function() {
    this.names = [];
    this.operating = {
      create: [],
      remove: [],
      start: [],
      stop: []
    }
  },
  emit: function() {
    this.names = []
    _.values(this.operating).forEach(names => this.names = this.names.concat(names));
    this.trigger(this.names);
  },
  onCreateStart: function(name) {
    this._push('create', name);
  },
  onCreateEnd: function(name) {
    this._remove('create', name);
  },
  onRemoveStart: function(name) {
    this._push('remove', name);
  },
  onRemoveEnd: function(name) {
    this._remove('remove', name);
  },
  onStartStart: function(name) {
    this._push('start', name);
  },
  onStartEnd: function(name) {
    this._remove('start', name);
  },
  onStopStart: function(name) {
    this._push('stop', name);
  },
  onStopEnd: function(name) {
    this._remove('stop', name);
  },
  _push: function(action:string, name) {
    this.operating[action].push(name);
    this.emit()
  },
  _remove: function(action:string, name) {
    _.pull(this.operating[action], name);
    this.emit()
  }
});
