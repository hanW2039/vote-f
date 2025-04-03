import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Space, Divider } from 'antd';
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
    <Link to={`/vote/${vote.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <Card 
        hoverable
        title={
          <div style={{ padding: '8px 0' }}>
            <Title level={3} style={{ fontSize: '24px', margin: 0, lineHeight: 1.4 }}>{vote.title}</Title>
            <Space size="middle" style={{ marginTop: '12px' }}>
              <Tag color={vote.vote_type === 'single' ? 'blue' : 'purple'} style={{ fontSize: '16px', padding: '4px 10px' }}>
                {vote.vote_type === 'single' ? '单选' : '多选'}
              </Tag>
              {isExpired && <Tag color="red" style={{ fontSize: '16px', padding: '4px 10px' }}>已结束</Tag>}
            </Space>
          </div>
        }
        style={{ 
          marginBottom: 24, 
          borderRadius: 12, 
          height: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{ padding: '24px' }}
        headStyle={{ padding: '16px 24px' }}
      >
        <Text strong style={{ fontSize: '20px', display: 'block', marginBottom: '20px', lineHeight: 1.5 }}>
          {vote.question}
        </Text>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '18px' }}>选项数量:</Text>
            <Text style={{ fontSize: '18px' }}>{vote.options_count}</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '18px' }}>开始时间:</Text>
            <Text style={{ fontSize: '18px' }}>{formatDate(vote.start_time)}</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '18px' }}>结束时间:</Text>
            <Text style={{ fontSize: '18px' }}>{formatDate(vote.end_time)}</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default VoteItem; 