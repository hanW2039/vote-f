import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Spin, Empty, Tag, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons';
import { VoteListItem } from '../types';
import { voteApi } from '../services/api';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { Search } = Input;

// 页面过渡动画
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// 列表项动画
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 单个列表项动画
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

const VoteList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<VoteListItem[]>([]);
  const [filteredVotes, setFilteredVotes] = useState<VoteListItem[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const { isDarkMode } = useTheme();
  
  // 加载投票列表
  const loadVotes = async () => {
    try {
      setLoading(true);
      const data = await voteApi.getVoteList();
      setVotes(data);
      setFilteredVotes(data);
    } catch (error) {
      console.error('获取投票列表失败', error);
      message.error('获取投票列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载
  useEffect(() => {
    loadVotes();
  }, []);
  
  // 搜索投票
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredVotes(votes);
      return;
    }
    
    const filtered = votes.filter(vote => {
      return vote.title.toLowerCase().includes(value.toLowerCase()) || 
        vote.question.toLowerCase().includes(value.toLowerCase());
    });
    
    setFilteredVotes(filtered);
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };
  
  // 查看投票详情
  const viewVoteDetail = (id: number) => {
    navigate(`/vote/${id}`);
  };
  
  // 创建新投票
  const createNewVote = () => {
    message.info('创建新投票功能即将上线');
  };
  
  // 判断投票是否已过期
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ 
        padding: '40px',
        minHeight: 'calc(100vh - 160px)',
        width: '100%',
        background: isDarkMode ? '#000000' : '#f8f8f8'
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <Title level={2} style={{ 
              margin: 0, 
              fontSize: '32px',
              background: 'linear-gradient(to right, #fe2c55, #25f4ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              <FireOutlined style={{ marginRight: '16px' }} />
              发现投票
            </Title>
            <Text style={{ 
              display: 'block', 
              marginTop: '10px', 
              fontSize: '16px',
              color: isDarkMode ? '#aaaaaa' : '#666666'
            }}>
              从下面选择一个投票参与，或者创建自己的投票
            </Text>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Search
              placeholder="搜索投票"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 250 }}
            />
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />} 
                onClick={createNewVote}
                style={{
                  background: '#fe2c55',
                  borderColor: '#fe2c55',
                  height: '50px',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(254, 44, 85, 0.3)'
                }}
              >
                创建投票
              </Button>
            </motion.div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip={<span style={{ marginTop: '15px', color: '#fe2c55' }}>加载中...</span>} />
          </div>
        ) : filteredVotes.length === 0 ? (
          <Empty 
            description={
              searchValue ? 
                <Text style={{ fontSize: '18px', color: isDarkMode ? '#aaaaaa' : '#666666' }}>未找到与 "{searchValue}" 相关的投票</Text> : 
                <Text style={{ fontSize: '18px', color: isDarkMode ? '#aaaaaa' : '#666666' }}>暂无投票</Text>
            }
            style={{ margin: '80px 0' }}
            imageStyle={{ filter: isDarkMode ? 'invert(0.8)' : 'invert(0.2)' }}
          />
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '24px',
              width: '100%'
            }}
          >
            {filteredVotes.map(vote => (
              <motion.div key={vote.id} variants={itemVariants}>
                <Card
                  style={{ 
                    borderRadius: '16px',
                    background: isDarkMode ? '#1a1a1a' : '#ffffff',
                    border: 'none',
                    overflow: 'hidden',
                    height: '100%',
                    cursor: 'pointer',
                    boxShadow: isDarkMode 
                      ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                      : '0 8px 24px rgba(0, 0, 0, 0.06)',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '24px' }}
                  onClick={() => viewVoteDetail(vote.id)}
                  hoverable
                >
                  <motion.div
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div style={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      right: '-20px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(254, 44, 85, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
                      zIndex: 0
                    }} />
                    
                    <div style={{ marginBottom: '20px' }}>
                      <Title level={4} style={{ 
                        marginTop: 0, 
                        marginBottom: '8px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: isDarkMode ? '#ffffff' : '#222222'
                      }}>
                        {vote.title}
                      </Title>
                      <Text style={{ 
                        fontSize: '16px',
                        display: 'block',
                        marginBottom: '16px',
                        color: isDarkMode ? '#aaaaaa' : '#666666',
                        minHeight: '48px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {vote.question}
                      </Text>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <Tag color={vote.vote_type === 'single' ? '#25f4ee' : '#fe2c55'} style={{ 
                          marginRight: '8px',
                          fontSize: '14px',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {vote.vote_type === 'single' ? '单选' : '多选'}
                        </Tag>
                        
                        <Tag color={isExpired(vote.end_time) ? '#666666' : '#52c41a'} style={{ 
                          fontSize: '14px',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {isExpired(vote.end_time) ? '已结束' : '进行中'}
                        </Tag>
                      </div>
                      
                      <Text style={{ 
                        color: isDarkMode ? '#aaaaaa' : '#666666', 
                        fontSize: '14px' 
                      }}>
                        {vote.options_count} 个选项
                      </Text>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <Text style={{ color: isDarkMode ? '#aaaaaa' : '#666666', fontSize: '13px' }}>开始时间</Text>
                        <Text style={{ color: isDarkMode ? '#ffffff' : '#222222', display: 'block', fontSize: '14px' }}>{formatDate(vote.start_time)}</Text>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <Text style={{ color: isDarkMode ? '#aaaaaa' : '#666666', fontSize: '13px' }}>结束时间</Text>
                        <Text style={{ 
                          color: isExpired(vote.end_time) ? '#ff7875' : (isDarkMode ? '#ffffff' : '#222222'), 
                          display: 'block',
                          fontSize: '14px'
                        }}>
                          {formatDate(vote.end_time)}
                        </Text>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoteList; 