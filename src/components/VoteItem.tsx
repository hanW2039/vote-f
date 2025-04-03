import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Space } from 'antd';
import { VoteListItem } from '../types';

const { Title, Text } = Typography;

interface VoteItemProps {
  vote: VoteListItem;
}

const VoteItem: React.FC<VoteItemProps> = ({ vote }) => {
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 判断投票是否已结束
  const isExpired = new Date(vote.end_time) < new Date();

  return (
    <Link to={`/vote/${vote.id}`} style={{ textDecoration: 'none' }}>
      <Card 
        hoverable
        title={
          <Space>
            <Title level={4}>{vote.title}</Title>
            <Tag color={vote.vote_type === 'single' ? 'blue' : 'purple'}>
              {vote.vote_type === 'single' ? '单选' : '多选'}
            </Tag>
            {isExpired && <Tag color="red">已结束</Tag>}
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Text strong>{vote.question}</Text>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">选项数量: {vote.options_count}</Text>
          <br />
          <Text type="secondary">开始时间: {formatDate(vote.start_time)}</Text>
          <br />
          <Text type="secondary">结束时间: {formatDate(vote.end_time)}</Text>
        </div>
      </Card>
    </Link>
  );
};

export default VoteItem; 