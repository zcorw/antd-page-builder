declare type RemoteMenuType = {
  id: number;
  pid: number;
  route_name: string;
  children?: RemoteMenuType[];
}

declare type AccountToken = {
  id: number;
  token: string;
};