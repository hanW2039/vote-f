import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Space, Divider } from 'antd';
import { VoteListItem } from '../types';
import { CalendarOutlined, TagOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

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
      <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
        <Card 
          hoverable
          title={
            <div style={{ padding: '8px 0' }}>
              <Title level={3} style={{ 
                fontSize: '22px', 
                margin: 0, 
                lineHeight: 1.4,
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                {vote.title}
              </Title>
              <Space size="middle" style={{ marginTop: '12px' }}>
                <Tag 
                  color={vote.vote_type === 'single' ? '#25f4ee' : '#fe2c55'} 
                  icon={<TagOutlined />}
                  style={{ 
                    fontSize: '14px', 
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontWeight: '600'
                  }}
                >
                  {vote.vote_type === 'single' ? '单选' : '多选'}
                </Tag>
                {isExpired && 
                  <Tag 
                    color="default" 
                    style={{ 
                      fontSize: '14px', 
                      padding: '4px 12px',
                      borderRadius: '16px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      fontWeight: '600',
                      color: '#666'
                    }}
                  >
                    已结束
                  </Tag>
                }
                {!isExpired && 
                  <Tag 
                    className="tiktok-tag"
                    style={{ 
                      fontSize: '14px', 
                      padding: '4px 12px', 
                      borderRadius: '16px',
                      fontWeight: '600',
                      background: 'rgba(254, 44, 85, 0.08)',
                      color: '#fe2c55'
                    }}
                  >
                    进行中
                  </Tag>
                }
              </Space>
            </div>
          }
          style={{ 
            height: '100%',
            border: 'none',
            borderRadius: '16px', 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '20px' }}
          headStyle={{ 
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)' 
          }}
        >
          <Text style={{ 
            fontSize: '18px', 
            display: 'block', 
            marginBottom: '20px', 
            lineHeight: 1.5,
            color: '#121212'
          }}>
            <InfoCircleOutlined style={{ marginRight: '8px', color: '#fe2c55' }} />
            {vote.question}
          </Text>
          
          <Divider style={{ margin: '16px 0', borderColor: 'var(--border-color)' }} />
          
          <div style={{ marginTop: 16 }}>
            <div style={{ 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--secondary-text-color)'
            }}>
              <div style={{ width: '24px', textAlign: 'center', marginRight: '8px' }}>
                <TagOutlined style={{ color: '#25f4ee' }} />
              </div>
              <span style={{ fontWeight: '600', marginRight: '8px' }}>选项数量:</span>
              <span>{vote.options_count}</span>
            </div>
            
            <div style={{ 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--secondary-text-color)'
            }}>
              <div style={{ width: '24px', textAlign: 'center', marginRight: '8px' }}>
                <CalendarOutlined style={{ color: '#fe2c55' }} />
              </div>
              <span style={{ fontWeight: '600', marginRight: '8px' }}>开始时间:</span>
              <span>{formatDate(vote.start_time)}</span>
            </div>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              color: 'var(--secondary-text-color)'
            }}>
              <div style={{ width: '24px', textAlign: 'center', marginRight: '8px' }}>
                <CalendarOutlined style={{ color: '#fe2c55' }} />
              </div>
              <span style={{ fontWeight: '600', marginRight: '8px' }}>结束时间:</span>
              <span>{formatDate(vote.end_time)}</span>
            </div>
          </div>
          
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '80px', 
              height: '80px', 
              overflow: 'hidden',
              pointerEvents: 'none'
            }}
          >
            <div 
              style={{ 
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '80px',
                height: '80px',
                background: 'rgba(254, 44, 85, 0.08)',
                transform: 'rotate(45deg)',
                zIndex: 0
              }}
            />
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default VoteItem; 