import React from 'react';
import { useIntl, FormattedMessage } from 'umi';
import ListPage, { ColunmsType, SearchType } from '@/components/ListPage';
import { useRangeDate, useSelect, useText } from '@/hooks/condition';
import { queryRule } from './service';
import { TableListItem } from './data.d';

const TableList: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  /** 表格字段 */
  const columns: ColunmsType<TableListItem> = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      tip: 'The rule name is the unique key',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description" />,
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleCallNo"
          defaultMessage="Number of service calls"
        />
      ),
      dataIndex: 'callNo',
      sorter: true,
      renderText: (val: string) =>
        `${val}${intl.formatMessage({
          id: 'pages.searchTable.tenThousand',
          defaultMessage: ' 万 ',
        })}`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleUpdatedAt"
          defaultMessage="Last scheduled time"
        />
      ),
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
  ];

  const search: SearchType<TableListItem> = [
    useText(intl.formatMessage({ id: 'pages.searchTable.updateForm.ruleName.nameLabel', defaultMessage: "Rule name" }), 'name'),
    useText(intl.formatMessage({ id: "pages.searchTable.titleDesc", defaultMessage: "Description" }), 'desc'),
    useText(intl.formatMessage({ id: "pages.searchTable.titleCallNo", defaultMessage: "Number of service calls" }), 'callNo'),
    useSelect(intl.formatMessage({ id: "pages.searchTable.titleStatus", defaultMessage: "Status" }), 'status', new Map([
      [0, intl.formatMessage({ id: "pages.searchTable.nameStatus.default", defaultMessage: "Shut down" })],
      [1, intl.formatMessage({ id: "pages.searchTable.nameStatus.running", defaultMessage: "Running" })],
      [2, intl.formatMessage({ id: "pages.searchTable.nameStatus.online", defaultMessage: "Online" })],
      [3, intl.formatMessage({ id: "pages.searchTable.nameStatus.abnormal", defaultMessage: "Abnormal" })],
    ])),
    useRangeDate(intl.formatMessage({ id: "pages.searchTable.titleUpdatedAt", defaultMessage: "Last scheduled time" }), 'updatedAt'),
  ];

  return <ListPage<TableListItem>
    title={intl.formatMessage({ id: 'list.table-list', defaultMessage: '查询表格' })}
    columns={columns}
    search={search}
    access="table"
    add
    edit
    detail
    dataSource={queryRule}
  />
}

export default TableList;