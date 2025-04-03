import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Card, Button, message, Tag, Alert, notification } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Vote, VoteStats } from '../types';
import { voteApi } from '../services/api';
import { useSSE } from '../hooks/useSSE';
import VoteForm from '../components/VoteForm';
import VoteResult from '../components/VoteResult';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

// 页面过渡动画
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 120,
      when: 'beforeChildren',
      staggerChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// 卡片动画
const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  }
};

const VoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  
  // 获取投票ID（数字类型）
  const voteId = id ? parseInt(id, 10) : 0;
  
  // 通过SSE获取实时投票数据
  const liveStats = useSSE(voteId);
  
  // 初始统计数据
  const [stats, setStats] = useState<VoteStats | null>(null);
  
  // 加载投票详情
  const loadVoteDetail = async () => {
    if (!voteId) {
      setError('无效的投票ID');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const voteData = await voteApi.getVoteDetail(voteId);
      setVote(voteData);
      
      // 获取初始统计数据
      const statsData = await voteApi.getVoteStats(voteId);
      setStats(statsData);
      
      setError(null);
    } catch (error) {
      console.error('获取投票详情失败', error);
      setError('获取投票详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载
  useEffect(() => {
    loadVoteDetail();
  }, [voteId]);
  
  // 当SSE数据更新时，更新统计结果
  useEffect(() => {
    if (liveStats) {
      setStats(liveStats);
      // 添加动态提示
      notification.info({
        message: '投票数据已更新',
        description: '有新的投票数据已经到达',
        placement: 'bottomRight',
        duration: 2,
      });
    }
  }, [liveStats]);
  
  // 投票提交成功后的回调
  const handleVoteSubmitted = async () => {
    try {
      message.success('投票数据已更新');
      const statsData = await voteApi.getVoteStats(voteId);
      setStats(statsData);
      
      // 显示通知提醒用户查看最新结果
      notification.success({
        message: '投票成功',
        description: '您的投票已成功提交，下方结果区域已更新最新数据。',
        placement: 'bottomRight',
        duration: 4,
      });
    } catch (error) {
      console.error('获取投票统计失败', error);
      message.error('获取最新投票统计失败');
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };
  
  // 删除投票
  const handleDeleteVote = async () => {
    try {
      await voteApi.deleteVote(voteId);
      message.success('投票已删除');
      navigate('/');
    } catch (error) {
      console.error('删除投票失败', error);
      message.error('删除投票失败，请稍后重试');
    }
  };
  
  // 返回列表页
  const goBack = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ 
          textAlign: 'center', 
          padding: '150px 0', 
          minHeight: 'calc(100vh - 160px)',
          width: '100%',
          background: isDarkMode ? '#000000' : '#f8f8f8'
        }}
      >
        <Spin size="large" tip={<span style={{ fontSize: '22px', marginTop: '15px', color: '#fe2c55' }}>加载中...</span>} />
      </motion.div>
    );
  }
  
  if (error || !vote) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{ 
          textAlign: 'center', 
          padding: '120px 0', 
          minHeight: 'calc(100vh - 160px)',
          width: '100%',
          background: isDarkMode ? '#000000' : '#f8f8f8'
        }}
      >
        <Alert
          message={<Title level={3} style={{ margin: 0, color: isDarkMode ? '#fff' : '#222' }}>出错了</Title>}
          description={<Text style={{ fontSize: '22px', color: isDarkMode ? '#aaa' : '#666' }}>{error || '投票不存在'}</Text>}
          type="error"
          showIcon
          style={{ 
            width: '80%', 
            maxWidth: '600px', 
            margin: '0 auto 40px auto', 
            padding: '24px',
            background: isDarkMode ? '#1f1f1f' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #eee'
          }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="primary" onClick={goBack} size="large" style={{ 
            fontSize: '20px', 
            height: '54px', 
            padding: '0 40px',
            background: '#fe2c55',
            borderColor: '#fe2c55'
          }}>
            返回投票列表
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  
  const isExpired = new Date(vote.end_time) < new Date();
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ 
        padding: '20px', 
        minHeight: 'calc(100vh - 160px)',
        margin: 0,
        width: '100%',
        background: isDarkMode ? '#000' : '#f8f8f8',
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: 0
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined style={{ fontSize: '22px' }} />} 
              onClick={goBack}
              size="large"
              style={{ 
                fontSize: '20px', 
                height: '50px', 
                padding: '0 16px',
                color: isDarkMode ? '#ffffff' : '#222222'
              }}
            >
              返回
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined style={{ fontSize: '20px' }} />} 
              onClick={handleDeleteVote}
              style={{ 
                fontSize: '18px', 
                height: '42px', 
                padding: '0 20px',
                borderRadius: '8px',
                background: 'rgba(254, 44, 85, 0.2)',
                borderColor: '#fe2c55',
                color: '#fe2c55'
              }}
            >
              删除投票
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div variants={cardVariants}>
          <Card 
            bodyStyle={{ padding: '30px' }} 
            style={{ 
              borderRadius: '16px',
              background: isDarkMode ? '#121212' : '#ffffff',
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
                : '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: 'none',
              overflow: 'hidden',
              marginBottom: '24px'
            }}
          >
            <div style={{
              position: 'relative',
              zIndex: 1,
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isDarkMode ? 0.3 : 0.1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  background: 'rgba(254, 44, 85, 0.2)',
                  zIndex: -1,
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isDarkMode ? 0.3 : 0.1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  position: 'absolute',
                  bottom: '-80px',
                  left: '-30px',
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                  background: 'rgba(37, 244, 238, 0.1)',
                  zIndex: -1,
                }}
              />
              
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Title level={1} style={{ 
                      fontSize: '36px', 
                      marginBottom: '16px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #fe2c55, #25f4ee)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>{vote.title}</Title>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Title level={3} style={{ 
                      fontSize: '24px', 
                      marginTop: 0,
                      marginBottom: '24px',
                      color: isDarkMode ? '#ffffff' : '#222222',
                      fontWeight: 'normal',
                    }}>{vote.question}</Title>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                  >
                    <Tag 
                      icon={vote.vote_type === 'single' ? <ThunderboltOutlined /> : <FireOutlined />} 
                      color={vote.vote_type === 'single' ? '#25f4ee' : '#fe2c55'} 
                      style={{ 
                        fontSize: '16px', 
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {vote.vote_type === 'single' ? '单选投票' : '多选投票'}
                    </Tag>
                    
                    {isExpired ? (
                      <Tag 
                        color="#333" 
                        style={{ 
                          fontSize: '16px', 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: isDarkMode ? '#aaa' : '#888'
                        }}
                      >
                        已结束
                      </Tag>
                    ) : (
                      <Tag 
                        color="green" 
                        style={{ 
                          fontSize: '16px', 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: 'rgba(37, 244, 238, 0.15)',
                          borderColor: '#25f4ee',
                          color: '#25f4ee'
                        }}
                      >
                        进行中
                      </Tag>
                    )}
                    
                    {stats && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                          delay: 0.5
                        }}
                      >
                        <Tag 
                          color="#fe2c55" 
                          style={{ 
                            fontSize: '16px', 
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: 'rgba(254, 44, 85, 0.15)',
                            borderColor: '#fe2c55',
                            color: '#fe2c55'
                          }}
                        >
                          {stats.total_votes} 人已参与
                        </Tag>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    flexWrap: 'wrap', 
                    marginTop: '16px',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: isDarkMode ? '#aaa' : '#666'
                  }}
                >
                  <div>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#aaa' : '#666', 
                      display: 'block', 
                      marginBottom: '6px' 
                    }}>
                      开始时间
                    </Text>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#fff' : '#222', 
                      display: 'block' 
                    }}>
                      {formatDate(vote.start_time)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#aaa' : '#666', 
                      display: 'block', 
                      marginBottom: '6px' 
                    }}>
                      结束时间
                    </Text>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#fff' : '#222',
                      display: 'block' 
                    }}>
                      {formatDate(vote.end_time)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#aaa' : '#666', 
                      display: 'block', 
                      marginBottom: '6px' 
                    }}>
                      投票选项数
                    </Text>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: isDarkMode ? '#fff' : '#222', 
                      display: 'block' 
                    }}>
                      {vote.options.length} 个选项
                    </Text>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
          
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.2 }}
        >
          <Card 
            bodyStyle={{ padding: '30px' }} 
            style={{ 
              borderRadius: '16px',
              background: isDarkMode ? '#121212' : '#ffffff',
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
                : '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: 'none',
              marginBottom: '24px'
            }}
          >
            <VoteForm vote={vote} onVoteSubmitted={handleVoteSubmitted} />
          </Card>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.4 }}
        >
          <Card 
            bodyStyle={{ padding: '30px' }} 
            style={{ 
              borderRadius: '16px',
              background: isDarkMode ? '#121212' : '#ffffff',
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
                : '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: 'none',
              marginBottom: '40px'
            }}
          >
            <VoteResult stats={stats} />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoteDetail; 