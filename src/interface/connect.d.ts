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

declare type PageInfoType = {
  page_info?: {
    page: number;
    per_page: number;
  };
  conditions?: conditionsType[];
  sort: Record<string, "ascend" | "descend" | null>;
};

/** 数据接口筛选条件结构（具体根据与后端商量结构为准） */
declare type conditionsType = {
  field_name: string;
  field_type: string;
  type: number;
  value?: any;
}