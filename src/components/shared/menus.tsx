import * as React from 'react';
import { ActiveLink } from './links';
import { MachineProps, ContainerProps } from './props';

const Semantify = require('react-semantify');
const { Link } = require('react-router');

interface MachineDetailMenuProps extends MachineProps {
  router: any
}

interface MachineContainerDetailMenuProps extends MachineProps, ContainerProps {
  router: any
}

interface ContainerDetailMenuProps extends ContainerProps {
  router: any
}

export const TopMenu = React.createClass<any, any>({
  render: function(){
    return (
      <Semantify.Menu className="top secondary">
        <div className="header item">
          <Link to="/">Neptune</Link>
        </div>
        <ActiveLink to="/machines" router={this.props.router}>Machines</ActiveLink>
        <ActiveLink to="/containers" router={this.props.router}>Containers</ActiveLink>
        <ActiveLink to="/images" router={this.props.router}>Images</ActiveLink>
      </Semantify.Menu>
    );
  }
});

export const MachineDetailMenu = React.createClass<MachineDetailMenuProps, any>({
  render: function(){
    var name = this.props.machineName;
    return (
      <Semantify.Menu className="secondary pointing">
        <ActiveLink to={`/machines/${name}`} router={this.props.router}>Dashboard</ActiveLink>
        <ActiveLink to={`/machines/${name}/containers`} router={this.props.router}>Containers</ActiveLink>
        <ActiveLink to={`/machines/${name}/images`} router={this.props.router}>Images</ActiveLink>
      </Semantify.Menu>
    );
  }
});

export class MachineContainerDetailMenu extends React.Component<MachineContainerDetailMenuProps, any>{
  render(){
    var { router, machineName, containerId } = this.props;
    return (
      <Semantify.Menu className="top attached tabular">
        <ActiveLink to={`/machines/${machineName}/containers/${containerId}/info`} router={router}>Info</ActiveLink>
        <ActiveLink to={`/machines/${machineName}/containers/${containerId}/logs`} router={router}>Logs</ActiveLink>
      </Semantify.Menu>
    );
  }
};

export class ContainerDetailMenu extends React.Component<ContainerDetailMenuProps, any>{
  render(){
    var { router, containerId } = this.props;
    return (
      <Semantify.Menu className="top attached tabular">
        <ActiveLink to={`/containers/${containerId}/info`} router={router}>Info</ActiveLink>
        <ActiveLink to={`/containers/${containerId}/logs`} router={router}>Logs</ActiveLink>
      </Semantify.Menu>
    );
  }
};
