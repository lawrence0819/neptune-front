import { combineReducers } from 'redux';
import ASYNC_STATUS from '../constants/async-status';
import * as ACTION_TYPES from '../constants/action-types';
import { AutoCompleteResult, AsyncAction } from '../constants/interfaces';

function createContainerTemp(options) {
  return {
    Id: Date.now().toString(),
    Names: ['/' + options.name || '/'],
    Command: options.Cmd,
    Image: options.Image,
    Status: 'Creating'
  };
}

function imagesToAutoComplete(action) {
  const images: AutoCompleteResult[] = [];
  action.result.forEach((image) => {
    image.RepoTags.forEach((repoTag) => {
      if (!/none/.test(image.repoTag)) {
        images.push({
          title: repoTag,
          description: ''
        });
      }
    })
  });
  return images;
}

function containerLog(action: AsyncAction) {
  let logs = '';

  if (action.asyncStatus === ASYNC_STATUS.COMPLETED) {
    logs = action.result || "";
  } else if (action.asyncStatus === ASYNC_STATUS.PROGRESS) {
    logs = action.progressData || "";
  }

  if (logs) {
    return  {
      requestId: action.id,
      logs: logs.replace(/[^\x20-\xE007F\n]/g, '')
    };
  }

  return undefined;
}

function createOperatingReducer(actionType: string, containerIdArgsIndex: number = 1) {
  return (state = [], action: AsyncAction) => {
    if (action.type === actionType) {
      let id = action.args[containerIdArgsIndex];
      switch (action.asyncStatus) {
        case ASYNC_STATUS.START:
          if (!_.isString(id)) {
            id = Date.now().toString();
            action.args.push(id);
          }
          return state.concat([id]);
        case ASYNC_STATUS.ENDED:
          if (!_.isString(id)) {
            id = _.last(action.args);
          }
          return state.filter(n => n !== id);
      }
    }
    return state;
  }
}

const operations = {
  inspect: createOperatingReducer(ACTION_TYPES.INSPECT_MACHINE_CONTAINER),
  create: createOperatingReducer(ACTION_TYPES.CREATE_MACHINE_CONTAINER),
  start: createOperatingReducer(ACTION_TYPES.START_MACHINE_CONTAINER),
  stop: createOperatingReducer(ACTION_TYPES.STOP_MACHINE_CONTAINER),
  remove: createOperatingReducer(ACTION_TYPES.REMOVE_MACHINE_CONTAINER),
  pause: createOperatingReducer(ACTION_TYPES.PAUSE_MACHINE_CONTAINER),
  unpause: createOperatingReducer(ACTION_TYPES.UNPAUSE_MACHINE_CONTAINER)
}

const localOperations = {
  inspect: createOperatingReducer(ACTION_TYPES.INSPECT_CONTAINER, 0),
  create: createOperatingReducer(ACTION_TYPES.CREATE_CONTAINER, 0),
  start: createOperatingReducer(ACTION_TYPES.START_CONTAINER, 0),
  stop: createOperatingReducer(ACTION_TYPES.STOP_CONTAINER, 0),
  remove: createOperatingReducer(ACTION_TYPES.REMOVE_CONTAINER, 0),
  pause: createOperatingReducer(ACTION_TYPES.PAUSE_CONTAINER, 0),
  unpause: createOperatingReducer(ACTION_TYPES.UNPAUSE_CONTAINER, 0)
}

function operatingByMachineName(state = {}, action) {
  if (action.asyncStatus) {
    const machineName = action.args[0];
    const operating:any = _.assign({}, state[machineName] || {});
    _.keys(operations).forEach(key => operating[key] = operations[key](operating[key], action))
    return _.assign({}, state, {
      [machineName]: operating
    });
  }
  return state;
}

function containersByMachineName(state = {}, action) {
  if (action.type === ACTION_TYPES.FETCH_MACHINE_CONTAINER_LIST) {
    const machineName = action.args[0];
    switch (action.asyncStatus) {
      case ASYNC_STATUS.COMPLETED:
        return _.assign({}, state, {
          [machineName]: action.result
        });
      default:
        return state;
    }
  } else if (action.type === ACTION_TYPES.CREATE_MACHINE_CONTAINER) {
    switch (action.asyncStatus) {
      case ASYNC_STATUS.START:
        const machineName = action.args[0];
        const options = action.args[1];
        let containers = state[machineName] || [];
        containers = containers.slice();
        containers.unshift(createContainerTemp(options));
        return _.assign({}, state, {
          [machineName]: containers
        });
    }
  }
  return state
}

function autoCompleteImagesByMachineName(state = {}, action) {
  if (action.type === ACTION_TYPES.FETCH_MACHINE_IMAGE_LIST) {
    switch (action.asyncStatus) {
      case ASYNC_STATUS.COMPLETED:
        const machineName = action.args[0];
        return _.assign({}, state, {
          [machineName]: imagesToAutoComplete(action)
        });
    }
  }
  return state
}

function containerInfosByMachineName(state = {}, action: AsyncAction) {
  if (action.type === ACTION_TYPES.INSPECT_MACHINE_CONTAINER
    && action.asyncStatus === ASYNC_STATUS.COMPLETED) {
      const machineName = action.args[0];
      const containerId = action.args[1];
      const machineContainers = _.assign({}, state[machineName]);
      machineContainers[containerId] = action.result;
      return _.assign({}, state, {
        [machineName]: machineContainers
      });
  }
  return state;
}

function containerLogsByMachineName(state = {}, action: AsyncAction) {
  if (action.type === ACTION_TYPES.FETCH_MACHINE_CONTAINER_LOGS) {
    const logs = containerLog(action);

    if (logs) {
      const machineName = action.args[0];
      const containerId = action.args[1];
      const machineContainers = _.assign({}, state[machineName]);
      machineContainers[containerId] = logs
      return _.assign({}, state, {
        [machineName]: machineContainers
      });
    }

  }
  return state;
}

function containers(state = [], action: AsyncAction) {
  if (action.type === ACTION_TYPES.FETCH_CONTAINER_LIST && action.asyncStatus === ASYNC_STATUS.COMPLETED) {
    return action.result;
  } else if (action.type === ACTION_TYPES.CREATE_CONTAINER && action.asyncStatus === ASYNC_STATUS.START) {
    let options = action.args[0];
    let containers = state.slice();
    containers.unshift(createContainerTemp(options));
    return containers;
  }
  return state
}

function operating(state = {}, action: AsyncAction) {
  if (action.asyncStatus) {
    const operating:any = _.assign({}, state);
    _.keys(localOperations).forEach(key => operating[key] = localOperations[key](operating[key], action))
    return operating
  }
  return state;
}

function autoCompleteImages(state = [], action: AsyncAction) {
  if (action.type === ACTION_TYPES.FETCH_IMAGE_LIST && action.asyncStatus === ASYNC_STATUS.COMPLETED) {
    return imagesToAutoComplete(action);
  }
  return state;
}

function containerInfosByContainerId(state = {}, action: AsyncAction) {
  if (action.type === ACTION_TYPES.INSPECT_CONTAINER && action.asyncStatus === ASYNC_STATUS.COMPLETED) {
      const containerId = action.args[0];
      const containers = _.assign({}, state);
      containers[containerId] = action.result;
      return containers;
  }
  return state;
}

function containerLogsByContainerId(state = {}, action: AsyncAction) {
  if (action.type === ACTION_TYPES.FETCH_CONTAINER_LOGS) {
    const containerId = action.args[0];
    const logs = containerLog(action);
    if (logs) {
      return _.assign({}, state, {
        [containerId]: logs
      })
    }
  }
  return state;
}

function showAll(state = true, action) {
  switch(action.type) {
    case ACTION_TYPES.SET_SHOW_ALL_CONTAINERS:
      return action.value;
  }
  return state;
}

export default combineReducers({
  operatingByMachineName,
  containersByMachineName,
  containerInfosByMachineName,
  containerLogsByMachineName,
  autoCompleteImagesByMachineName,
  containers,
  operating,
  autoCompleteImages,
  containerInfosByContainerId,
  containerLogsByContainerId,
  showAll
})
