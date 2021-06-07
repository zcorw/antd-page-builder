import React, { useEffect, useState } from 'react';
import EditPage from '@/components/EditPage';
import type { ItemType } from '@/components/Descriptions';
import Descriptions from '@/components/Descriptions';
import { useParams, useIntl } from 'umi';
import type { TableListItem } from './data.d';
import { getRule } from './service';
import { Badge, Card, Space, Typography } from 'antd';
import type { BadgeProps } from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar/avatar';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TableListItem>();
  const intl = useIntl();

  useEffect(() => {
    getRule(+id).then((res) => {
      setData(res)
    })
  }, [id]);

  const getStatus = (status: number): { text: string, status: BadgeProps['status'] } => {
    switch (status) {
      case 0:
        return {
          text: intl.formatMessage({ id: 'pages.searchTable.nameStatus.default', defaultMessage: 'Shut down' }),
          status: 'default',
        };
      case 1:
        return {
          text: intl.formatMessage({ id: 'pages.searchTable.nameStatus.running', defaultMessage: 'Running' }),
          status: 'processing',
        };
      case 2:
        return {
          text: intl.formatMessage({ id: 'pages.searchTable.nameStatus.online', defaultMessage: 'Online' }),
          status: 'success',
        };
      case 3:
        return {
          text: intl.formatMessage({ id: 'pages.searchTable.nameStatus.abnormal', defaultMessage: 'Abnormal' }),
          status: 'error',
        };
      default:
        return {
          text: intl.formatMessage({ id: 'pages.searchTable.nameStatus.default', defaultMessage: 'Shut down' }),
          status: 'default',
        };
    }
  }

  const columns: ItemType<TableListItem>[] = [
    {
      key: 'name',
      label: intl.formatMessage({ id: 'pages.searchTable.updateForm.ruleName.nameLabel', defaultMessage: 'Rule name' }),
    },
    {
      key: 'status',
      label: intl.formatMessage({ id: 'pages.searchTable.titleStatus', defaultMessage: 'Status' }),
      render(text) {
        const status = getStatus(text);
        return <Badge {...status} />;
      }
    },
    {
      key: 'user',
      label: intl.formatMessage({ id: 'pages.searchTable.user', defaultMessage: 'Creator' }),
      render(text, record) {
        return <Space><Avatar src={record.avatar}/><Typography.Text>{record.owner}</Typography.Text></Space>
      }
    },
    {
      key: 'updatedAt',
      label: intl.formatMessage({ id: 'pages.searchTable.titleUpdatedAt', defaultMessage: 'Last scheduled time' }),
    },
    {
      key: 'desc',
      label: intl.formatMessage({ id: 'pages.searchTable.titleDesc', defaultMessage: 'Description' }),
      span: 2,
    },
    {
      key: 'callNo',
      label: intl.formatMessage({ id: 'pages.searchTable.titleCallNo', defaultMessage: 'Number of service calls' }),
      render(text, record) {
        return `${text}${intl.formatMessage({ id: 'pages.searchTable.tenThousand', defaultMessage: '万' })}`
      }
    },
    {
      key: 'totalNo',
      label: intl.formatMessage({ id: 'pages.searchTable.totalServiceCalls', defaultMessage: 'Number of service calls' }),
      render(text, record) {
        const total = (record.callNo || 0) / ((record.progress || 100) / 100);
        return `${total}${intl.formatMessage({ id: 'pages.searchTable.tenThousand', defaultMessage: '万' })}`
      }
    },
  ];

  return (
    <EditPage>
      <Card>
        <Descriptions itemColumns={columns} value={data} column={2} bordered />
      </Card>
    </EditPage>
  )
}

export default Detail;