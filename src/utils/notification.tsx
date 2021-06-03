import React from 'react';
import { message, notification } from 'antd';

export const success = (content: string) => {
  message.success(content);
}

export const warning = (content: string) => {
  notification.warn({ message: content });
}

export const error = (content: string) => {
  notification.error({ message: content });
}

export const html = (title: string, content: string) => {
  notification.open({
    message: title,
    description: <div dangerouslySetInnerHTML={{__html: content}} />,
    duration: null
  })
}
