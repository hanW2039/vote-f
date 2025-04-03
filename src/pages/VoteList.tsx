import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Empty, Pagination, Input, Card } from 'antd';
import { SearchOutlined, ThunderboltOutlined, HistoryOutlined } from '@ant-design/icons';
import { VoteListItem } from '../types';
import { voteApi } from '../services/api';
import VoteItem from '../components/VoteItem';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// 列表动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    } 
  }
};

// 卡片动画变体
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};

const VoteList: React.FC = () => {
  const [votes, setVotes] = useState<VoteListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeOnly, setActiveOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 加载投票列表
  const loadVotes = async () => {
    try {
      setLoading(true);
      const skip = (pagination.current - 1) * pagination.pageSize;
      const params = {
        skip,
        limit: pagination.pageSize,
        active_only: activeOnly
      };
      
      const data = await voteApi.getVoteList(params);
      setVotes(data);
      
      // 实际应用中这里应该从后端获取总数，这里简化处理
      setPagination(prev => ({
        ...prev,
        total: data.length + skip // 这只是一个简化的计算方式
      }));
    } catch (error) {
      console.error('获取投票列表失败', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载和依赖变更时重新加载数据
  useEffect(() => {
    loadVotes();
  }, [pagination.current, pagination.pageSize, activeOnly]);

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize
    });
  };

  // 筛选显示的投票（本地搜索功能）
  const filteredVotes = searchText.trim() 
    ? votes.filter(vote => 
        vote.title.toLowerCase().includes(searchText.toLowerCase()) || 
        vote.question.toLowerCase().includes(searchText.toLowerCase())
      )
    : votes;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        padding: '40px 40px', 
        maxWidth: '100%', 
        minHeight: 'calc(100vh - 160px)',
        margin: 0,
        width: '100%'
      }}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Title level={1} style={{ 
          fontSize: '38px', 
          marginBottom: '36px', 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textShadow: '0 2px 8px rgba(254, 44, 85, 0.2)'
        }}>
          投票列表
        </Title>
      </motion.div>
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card 
          className="tiktok-card"
          style={{ 
            marginBottom: '32px', 
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }} 
          bodyStyle={{ padding: '30px' }}
        >
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              flex: '0 0 300px'
            }}>
              <Text strong style={{ 
                fontSize: '20px', 
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                display: 'block'
              }}>
                显示选项
              </Text>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%',
                height: '54px'
              }}>
                <button
                  onClick={() => setActiveOnly(!activeOnly)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeOnly 
                      ? 'linear-gradient(45deg, #fe2c55, #25f4ee)'
                      : 'rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: activeOnly ? 'flex-start' : 'flex-end',
                    padding: '0 16px'
                  }}
                  className="tiktok-button"
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      position: 'absolute',
                      left: activeOnly ? '6px' : 'auto',
                      right: activeOnly ? 'auto' : '6px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      zIndex: 1,
                      marginLeft: activeOnly ? '56px' : '0',
                      marginRight: activeOnly ? '0' : '56px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {activeOnly ? (
                      <>
                        <ThunderboltOutlined style={{ fontSize: '18px' }} />
                        <span>仅显示进行中</span>
                      </>
                    ) : (
                      <>
                        <HistoryOutlined style={{ fontSize: '18px' }} />
                        <span>显示所有</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              flex: '1 1 300px'
            }}>
              <Text strong style={{ 
                fontSize: '20px', 
                display: 'block',
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                搜索投票
              </Text>
              <Input 
                placeholder="输入标题或问题关键词..." 
                onChange={e => setSearchText(e.target.value)}
                style={{ 
                  width: '100%',
                  height: '54px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  borderColor: '#f0f0f0'
                }}
                prefix={<SearchOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#fe2c55' }} />}
                allowClear
                size="large"
              />
            </div>
          </div>
        </Card>
      </motion.div>
      
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '120px 0' }}
        >
          <Spin size="large" tip={
            <span style={{ 
              fontSize: '22px', 
              marginTop: '20px',
              background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              加载中...
            </span>
          } />
        </motion.div>
      ) : filteredVotes.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row gutter={[32, 32]}>
              {filteredVotes.map(vote => (
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={vote.id}>
                  <motion.div variants={itemVariants}>
                    <VoteItem vote={vote} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginTop: 60, textAlign: 'center', paddingBottom: 40 }}
          >
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              responsive
              showTotal={total => <span style={{ fontSize: '16px' }}>共 {total} 个投票</span>}
              style={{ fontSize: '16px' }}
            />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', padding: '100px 0' }}
        >
          <Empty 
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{ height: 120 }}
            description={
              <Text style={{ 
                fontSize: '24px',
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                暂无投票数据
              </Text>
            } 
            style={{ fontSize: '18px' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoteList; 