import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Divider, Spin, Card, Button, message, Tag, Space } from 'antd';
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
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (error || !vote) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={3}>{error || '投票不存在'}</Title>
        <Button type="primary" onClick={goBack}>返回投票列表</Button>
      </div>
    );
  }
  
  const isExpired = new Date(vote.end_time) < new Date();
  
  return (
    <div style={{ padding: '12px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={goBack}
          size="large"
        >
          返回列表
        </Button>
      </div>
      
      <Card bodyStyle={{ padding: '16px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px' 
        }}>
          <div>
            <Title level={2} style={{ fontSize: '24px', marginBottom: '8px' }}>{vote.title}</Title>
            <Space size="small">
              <Tag color={vote.vote_type === 'single' ? 'blue' : 'purple'}>
                {vote.vote_type === 'single' ? '单选' : '多选'}
              </Tag>
              {isExpired && <Tag color="red">已结束</Tag>}
            </Space>
          </div>
          
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDeleteVote}
            style={{ alignSelf: 'flex-start' }}
            size="middle"
          >
            删除投票
          </Button>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <Title level={4} style={{ fontSize: '18px' }}>{vote.question}</Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>开始时间: {formatDate(vote.start_time)}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '14px' }}>结束时间: {formatDate(vote.end_time)}</Text>
        </div>
        
        <Divider style={{ margin: '24px 0' }} />
        
        <VoteForm vote={vote} onVoteSubmitted={handleVoteSubmitted} />
        
        <Divider style={{ margin: '24px 0' }} />
        
        <VoteResult stats={stats} />
      </Card>
    </div>
  );
};

export default VoteDetail; 