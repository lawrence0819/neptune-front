export interface CommonProps {
  //key?: any,
  children?: any
}

export interface StyleableProps extends CommonProps {
  className?: string
}

export interface MachineProps extends CommonProps {
  machineName: string
}

export interface MachineIpProps extends MachineProps {
  machineIp: string
}

export interface MachineStyleableProps extends StyleableProps, MachineProps {

}

export interface LinkProps extends StyleableProps {
  to: string
}

export interface ActiveLinkProps extends CommonProps {
  router: any,
  to: string
}

export interface IconProps extends CommonProps {
  icon?: string
}

export interface ContainerProps {
  containerId: string
}

export interface ContainerStyleableProps extends ContainerProps, StyleableProps {

}

export interface FetchContainerListActionProps extends CommonProps {
  fetchContainerList: (options: any) => void
}

export interface CreateContainerActionProps extends CommonProps {
  createContainer: (options: any) => void
}

export interface StartContainerActionProps extends CommonProps {
  startContainer: (containerId: string, options?: any) => void
}

export interface StopContainerActionProps extends CommonProps {
  stopContainer: (containerId: string, options?: any) => void
}

export interface RemoveContainerActionProps extends CommonProps {
  removeContainer: (containerId: string, options?: any) => void
}

export interface CreateContainerHostUrlActionProps extends CommonProps {
  createHostUrl: (hostPort: string) => string
}

export interface CreateContainerDetailPathActionProps extends CommonProps {
  createContainerDetailPath: (containerId: string) => string
}

export interface MachineImageProps extends MachineProps {
  imageName: string
}

export interface MachineImageStyleableProps extends MachineImageProps, StyleableProps {

}

export interface RemoveMachineImageActionProps extends CommonProps {
  removeMachineImage: (machineName: string, imageName: string, options?: any) => void
}
