import React, { useMemo, useRef, useState } from 'react';
import BatchButton, { actionType as BatchActionType } from '@/components/Table/batchButton';
import history from '@/utils/history';
import { UploadOutlined } from '@ant-design/icons';
import CheckTable, { ActionType as TableAction, propsType as TableProps } from '../Table';
import Button, { DeleteBtn, ExportBtn } from '../Button';
import ImportModal, { propsType as ImportPropsType } from '../ImportModal';
import type { FormInstance } from 'antd/lib/form';
import type { ProTableProps } from '@ant-design/pro-table';

export type ActionType<T> = TableAction<T>;

type ButtonType = {
  key: string;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

type ColOptionType = {
  key: string;
  title: string;
  onClick: () => void;
} | React.ReactElement;

export type propsType<T> = {
  /**
   * @name actionRef Table action 的引用
   */
  actionRef?: React.MutableRefObject<ActionType<T> | undefined>;
  /**
   * @name form form action 的引用
   */
  form?: React.MutableRefObject<FormInstance | undefined>;
  /**
   * @name columns 表格字段
   */
  columns: TableProps<T>['tableColumns'];
  /**
  * @name search 顶部筛选栏字段
  */
  search: TableProps<T>['searchColumns'];
  /**
   * @name access 权限控制标记（见总后台权限管理的前端路由标识）
   */
  access: string;
  /**
   * @name dataSource 数据请求接口
   */
  dataSource: (pageInfo: PageInfoType) => Promise<{total_count: number, list: T[]}>;
  /**
   * @name add 是否有新增按钮
   */
  add?:
  | {
    push: () => void;
  }
  | true;
  /**
   * @name edit 是否有编辑按钮
   */
  edit?:
  | {
    push: (record: T) => void;
  }
  | true;
  /**
   * @name remove 是否有删除按钮
   */
  remove?: {
    fetch: (id: number) => Promise<void>;
    nameKey: string;
  };
  /**
   * @name detail 是否有查看详情
   */
  detail?:
  | {
    push: (record: T) => void;
  }
  | true;
  /**
   * @name batchRemove 设置批量删除按钮
   */
  batchRemove?: {
    url?: string;
    fetch?: (ids: number[]) => Promise<boolean>
  };
  /**
   * @name import 设置导入按钮
   */
  import?: {
    template: string;
    url: string;
    extraButtons?: ImportPropsType['buttons'];
  };
  /**
   * @name export 设置导出按钮
   */
  export?: {
    url: string;
    params?: (conditions: any) => any,
    isConditions?: boolean,
  };
  /**
   * @name buttonExtra 表格顶部自定义按钮
   */
  buttonExtra?: ButtonType[];
  /**
   * @name optionExtra 表格操作字段下自定义操作
   */
  optionExtra?: (_: React.ReactNode, record: T) => ColOptionType[];
  /**
   * @name searchConfig 自定义筛选字段
   */
  searchConfig?: ProTableProps<T, {}>['search'];
  rowKey?: string;
  /**
   * @name columnsOptions 是否展示操作字段
   */
  hasOptions?: boolean;
};

const createButton = (buttons: ButtonType[]) => {
  return buttons.reduce((res, button) => {
    return {
      ...res,
      [button.key]: <Button icon={button.icon} onClick={button.onClick}>{button.title}</Button>
    }
  }, {});
}

const createOption = (option: ColOptionType) => {
  return React.isValidElement(option) ? option : <a key={option.key} onClick={option.onClick}>{option.title}</a>;
}

const createBatchRemoveButton = (option: { url?: string, fetch?: (ids: number[]) => Promise<boolean> }, props: any): React.ReactElement => {
  if (option.url === undefined) {
    return <BatchButton url={option.url} {...props} />
  }
  if (option.fetch === undefined) {
    return <BatchButton customFetch={option.fetch} {...props} />
  }
  throw Error('Parameter error');
}

const createImportButton = <T extends object>(importProps: propsType<T>['import'], visible: boolean, onClose: (ok: boolean) => void): React.ReactNode => {
  if (importProps === undefined) {
    return null;
  }
  let importBtn: ImportPropsType['buttons'] = [
    {
      title: '导入文件',
      action: importProps?.url,
      icon: <UploadOutlined />
    },
  ];
  if (importProps?.extraButtons) {
    importBtn = importBtn.concat(importProps.extraButtons);
  }
  return <ImportModal visible={visible} buttons={importBtn} fileLink={importProps.template} onClose={onClose} />;
}
/** 表格组件 */
const Table = <T extends object = {}>(props: propsType<T>) => {
  const { access, search, remove, edit, add, batchRemove, dataSource, import: importProps, export: exportProps, actionRef, buttonExtra, optionExtra, detail, searchConfig, form: formProps, columns, rowKey = 'id', hasOptions = true, ...p } = props;
  const formRef = useRef<ActionType<T>>();
  const form = useMemo(() => actionRef || formRef, [actionRef, formRef]);
  const batchRef = useRef<BatchActionType>();
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  const updatePush = (record: T) => {
    if (edit !== undefined) edit === true ? history.edit(access, record[rowKey]).push() : edit.push(record);
  };

  const detailPush = (record: T) => {
    if (detail !== undefined) detail === true ? history.detail(access, record[rowKey]).push() : detail.push(record);
  };

  const tableColumns: TableProps<T>['tableColumns'] = [
    ...columns,
  ];
  /** 操作字段 */
  const optionColumns: TableProps<T>['tableColumns'] = !hasOptions ?
    [] :
    [
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        render(text, record) {
          let options = [
            detail ? (
              <a key="detail" onClick={() => detailPush(record)}>
                详情
              </a>
            ) : null,
            edit ? (
              <a key="edit" onClick={() => updatePush(record)}>
                编辑
              </a>
            ) : null,
            remove ? (
              <DeleteBtn
                key="del"
                id={record[rowKey]}
                name={record[remove.nameKey]}
                fetch={remove.fetch}
                tableRef={form}
              />
            ) : null,
          ];
          if (optionExtra === undefined) {
            return options;
          }
          const extra = optionExtra(text, record);
          return options.concat(extra.map(item => createOption(item)));
        },
      },
    ];
  /** 筛选条件 */
  const searchColumns: TableProps<T>['searchColumns'] = search;
  /** 顶部按钮 */
  const buttons: { add?: React.ReactNode; del?: React.ReactNode; import?: React.ReactNode; export?: React.ReactNode; } = {};
  if (add) {
    buttons.add = (
      <Button iconType="add" onClick={add === true ? () => history.add(access).push() : add.push}>
        添加
      </Button>
    );
  }
  if (importProps) {
    buttons.import = (
      <Button iconType="import" onClick={() => setExportVisible(true)}>导入</Button>
    )
  }
  if (exportProps) {
    const getParams = () => {
      const filter = form.current?.getFilter();
      const conditions = filter?.reduce((res, item) => {
        if (item.field_type === 'date') {
          const key = item.type === 7 ? `${item.field_name}_start` : `${item.field_name}_end`;
          return {
            ...res,
            [key]: item.value,
          }
        }
        return {
          ...res,
          [item.field_name]: item.value,
        }
      }, {});

      if (exportProps.params) {
        return exportProps.params(conditions);
      }
      return conditions;
    }
    buttons.export = (
      <ExportBtn action={exportProps.url} params={getParams} />
    )
  }
  if (batchRemove) {
    buttons.del = createBatchRemoveButton(batchRemove, { actionRef: batchRef, tableRef: form });
  }
  if (buttonExtra) {
    const extra = createButton(buttonExtra);
    Object.assign(buttons, extra);
  }
  const onSelect: TableProps<T>['onSelect'] = (selectedRowKeys, selectedRows) => {
    batchRef.current?.setSelectd(selectedRows.map((row) => row[rowKey]));
  };

  const closeImport = (ok: boolean) => {
    setExportVisible(false);

    form.current?.reload();
  }

  const customProps: {search?: ProTableProps<T, {}>['search'], formRef?: React.MutableRefObject<FormInstance<any> | undefined>} = {};
  if (searchConfig) {
    customProps.search = searchConfig;
  }
  if (formProps) {
    customProps.formRef = formProps;
  }
  return (
    <>
      <CheckTable
        actionRef={form}
        tableColumns={tableColumns.concat(optionColumns)}
        searchColumns={searchColumns}
        tableData={dataSource}
        onSelect={onSelect}
        buttons={buttons}
        {...customProps}
        {...p}
      />
      {createImportButton(importProps, exportVisible, closeImport)}
    </>
  )
};

export default Table;
