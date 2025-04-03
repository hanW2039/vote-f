import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Divider, Spin, Card, Button, Tag, Space, Alert } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Vote, VoteStats } from '../types';
import { voteApi } from '../services/api';
import { useSSE } from '../hooks/useSSE';
import VoteForm from '../components/VoteForm';
import VoteResult from '../components/VoteResult';
import { motion } from 'framer-motion';
import MessageModal from '../components/MessageModal';

const { Title, Text } = Typography;

const VoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取投票ID（数字类型）
  const voteId = id ? parseInt(id, 10) : 0;
  
  // 通过SSE获取实时投票数据
  const liveStats = useSSE(voteId);
  
  // 初始统计数据
  const [stats, setStats] = useState<VoteStats | null>(null);
  
  const [messageModal, setMessageModal] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  
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
    }
  }, [liveStats]);
  
  // 投票提交成功后的回调
  const handleVoteSubmitted = async () => {
    try {
      const statsData = await voteApi.getVoteStats(voteId);
      setStats(statsData);
    } catch (error) {
      console.error('获取投票统计失败', error);
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };
  
  // 显示消息弹窗
  const showMessageModal = (message: string, type: 'success' | 'error') => {
    setMessageModal({
      visible: true,
      message,
      type,
    });
  };
  
  // 关闭消息弹窗
  const closeMessageModal = () => {
    setMessageModal(prev => ({
      ...prev,
      visible: false,
    }));
  };
  
  // 删除投票
  const handleDeleteVote = async () => {
    try {
      const response = await voteApi.deleteVote(voteId);
      
      // 使用API返回的消息
      if (response.success) {
        showMessageModal(response.message || '投票已删除', 'success');
        // 延迟导航，让用户看到消息
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        showMessageModal(response.message || '删除投票失败，请稍后重试', 'error');
      }
    } catch (error) {
      console.error('删除投票失败', error);
      showMessageModal('删除投票失败，请稍后重试', 'error');
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
        style={{ 
          textAlign: 'center', 
          padding: '150px 0', 
          minHeight: 'calc(100vh - 160px)',
          width: '100%'
        }}
      >
        <Spin size="large" tip={
          <span style={{ 
            fontSize: '22px', 
            marginTop: '15px',
            background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            加载中...
          </span>
        } />
      </motion.div>
    );
  }
  
  if (error || !vote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          textAlign: 'center', 
          padding: '120px 0', 
          minHeight: 'calc(100vh - 160px)',
          width: '100%'
        }}
      >
        <Alert
          message={<Title level={3} style={{ margin: 0, color: '#fe2c55' }}>出错了</Title>}
          description={<Text style={{ fontSize: '22px' }}>{error || '投票不存在'}</Text>}
          type="error"
          showIcon
          style={{ width: '80%', maxWidth: '600px', margin: '0 auto 40px auto', padding: '24px' }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            type="primary" 
            onClick={goBack} 
            size="large" 
            style={{ 
              fontSize: '20px', 
              height: '54px', 
              padding: '0 40px',
              background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
              borderColor: 'transparent',
              fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(254, 44, 85, 0.25)'
            }}
          >
            返回投票列表
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  
  const isExpired = new Date(vote.end_time) < new Date();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        padding: '40px', 
        minHeight: 'calc(100vh - 160px)',
        margin: 0,
        width: '100%'
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: 0
      }}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 36 }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} 
              onClick={goBack}
              size="large"
              className="tiktok-button"
              style={{ 
                fontSize: '18px', 
                height: '50px', 
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(254, 44, 85, 0.25)'
              }}
            >
              返回列表
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card 
            className="tiktok-card"
            bodyStyle={{ padding: '36px' }} 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
              border: 'none'
            }}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '32px' 
            }}>
              <div>
                <Title level={1} style={{ 
                  fontSize: '36px', 
                  marginBottom: '20px',
                  background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}>{vote.title}</Title>
                <Space size="large">
                  <Tag color={vote.vote_type === 'single' ? '#25f4ee' : '#fe2c55'} style={{ 
                    fontSize: '16px', 
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontWeight: '600'
                  }}>
                    {vote.vote_type === 'single' ? '单选' : '多选'}
                  </Tag>
                  {isExpired && <Tag color="#666" style={{ 
                    fontSize: '16px', 
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontWeight: '600',
                    background: 'rgba(0, 0, 0, 0.06)'
                  }}>已结束</Tag>}
                  {!isExpired && <Tag color="#fe2c55" style={{ 
                    fontSize: '16px', 
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontWeight: '600',
                    background: 'rgba(254, 44, 85, 0.08)'
                  }}>进行中</Tag>}
                </Space>
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary" 
                  danger 
                  icon={<DeleteOutlined style={{ fontSize: '18px' }} />} 
                  onClick={handleDeleteVote}
                  style={{ 
                    alignSelf: 'flex-start', 
                    fontSize: '16px', 
                    height: '46px', 
                    padding: '0 24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(254, 44, 85, 0.1)',
                    color: '#fe2c55',
                    border: '1px solid rgba(254, 44, 85, 0.2)',
                    fontWeight: '600'
                  }}
                  size="large"
                >
                  删除投票
                </Button>
              </motion.div>
            </div>
            
            <div style={{ marginTop: 36 }}>
              <Title level={3} style={{ fontSize: '26px', marginBottom: '20px' }}>{vote.question}</Title>
              <Text style={{ fontSize: '18px', display: 'block', marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '18px', marginRight: '8px' }}>开始时间:</Text> 
                {formatDate(vote.start_time)}
              </Text>
              <Text style={{ fontSize: '18px', display: 'block' }}>
                <Text strong style={{ fontSize: '18px', marginRight: '8px' }}>结束时间:</Text> 
                {formatDate(vote.end_time)}
              </Text>
            </div>
            
            <Divider style={{ margin: '40px 0', borderWidth: '1px', borderColor: 'var(--border-color)' }} />
            
            <VoteForm vote={vote} onVoteSubmitted={handleVoteSubmitted} />
            
            <Divider style={{ margin: '40px 0', borderWidth: '1px', borderColor: 'var(--border-color)' }} />
            
            <VoteResult stats={stats} />
          </Card>
        </motion.div>
      </div>
      
      <MessageModal
        visible={messageModal.visible}
        message={messageModal.message}
        type={messageModal.type}
        onClose={closeMessageModal}
      />
    </motion.div>
  );
};

export default VoteDetail; 