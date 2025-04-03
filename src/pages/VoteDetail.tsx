import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Divider, Spin, Card, Button, message, Tag, Space, Alert } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Vote, VoteStats } from '../types';
import { voteApi } from '../services/api';
import { useSSE } from '../hooks/useSSE';
import VoteForm from '../components/VoteForm';
import VoteResult from '../components/VoteResult';

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
      <div style={{ textAlign: 'center', padding: '150px 0' }}>
        <Spin size="large" tip={<span style={{ fontSize: '22px', marginTop: '15px' }}>加载中...</span>} />
      </div>
    );
  }
  
  if (error || !vote) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Alert
          message={<Title level={3} style={{ margin: 0 }}>出错了</Title>}
          description={<Text style={{ fontSize: '22px' }}>{error || '投票不存在'}</Text>}
          type="error"
          showIcon
          style={{ width: '80%', maxWidth: '600px', margin: '0 auto 40px auto', padding: '24px' }}
        />
        <Button type="primary" onClick={goBack} size="large" style={{ fontSize: '20px', height: '54px', padding: '0 40px' }}>
          返回投票列表
        </Button>
      </div>
    );
  }
  
  const isExpired = new Date(vote.end_time) < new Date();
  
  return (
    <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined style={{ fontSize: '24px' }} />} 
          onClick={goBack}
          size="large"
          style={{ fontSize: '22px', height: '60px', padding: '0 20px' }}
        >
          返回列表
        </Button>
      </div>
      
      <Card 
        bodyStyle={{ padding: '36px' }} 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '32px' 
        }}>
          <div>
            <Title level={1} style={{ fontSize: '36px', marginBottom: '20px' }}>{vote.title}</Title>
            <Space size="large">
              <Tag color={vote.vote_type === 'single' ? 'blue' : 'purple'} style={{ fontSize: '18px', padding: '6px 16px' }}>
                {vote.vote_type === 'single' ? '单选' : '多选'}
              </Tag>
              {isExpired && <Tag color="red" style={{ fontSize: '18px', padding: '6px 16px' }}>已结束</Tag>}
            </Space>
          </div>
          
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined style={{ fontSize: '22px' }} />} 
            onClick={handleDeleteVote}
            style={{ alignSelf: 'flex-start', fontSize: '20px', height: '50px', padding: '0 30px' }}
            size="large"
          >
            删除投票
          </Button>
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
        
        <Divider style={{ margin: '40px 0', borderWidth: '2px' }} />
        
        <VoteForm vote={vote} onVoteSubmitted={handleVoteSubmitted} />
        
        <Divider style={{ margin: '40px 0', borderWidth: '2px' }} />
        
        <VoteResult stats={stats} />
      </Card>
    </div>
  );
};

export default VoteDetail; 