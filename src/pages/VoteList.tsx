import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Empty, Pagination, Switch, Input, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { VoteListItem } from '../types';
import { voteApi } from '../services/api';
import VoteItem from '../components/VoteItem';

const { Title, Text } = Typography;

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
    <div style={{ padding: '28px 24px', maxWidth: '100%' }}>
      <Title level={1} style={{ fontSize: '38px', marginBottom: '36px', textAlign: 'center' }}>投票列表</Title>
      
      <Card 
        style={{ 
          marginBottom: '32px', 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }} 
        bodyStyle={{ padding: '30px' }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <Text strong style={{ fontSize: '22px', marginRight: '16px' }}>显示选项：</Text>
            <Switch 
              checked={activeOnly} 
              onChange={setActiveOnly} 
              checkedChildren="仅显示进行中" 
              unCheckedChildren="显示所有" 
              style={{ width: '180px', height: '38px' }}
            />
          </div>
          
          <div>
            <Text strong style={{ fontSize: '22px', display: 'block', marginBottom: '12px' }}>搜索投票：</Text>
            <Input 
              placeholder="输入标题或问题关键词..." 
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '100%', maxWidth: '900px', height: '54px' }}
              prefix={<SearchOutlined style={{ fontSize: '22px', marginRight: '8px' }} />}
              allowClear
              size="large"
            />
          </div>
        </div>
      </Card>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <Spin size="large" tip={<span style={{ fontSize: '22px', marginTop: '20px' }}>加载中...</span>} />
        </div>
      ) : filteredVotes.length > 0 ? (
        <>
          <Row gutter={[32, 32]}>
            {filteredVotes.map(vote => (
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={vote.id}>
                <VoteItem vote={vote} />
              </Col>
            ))}
          </Row>
          
          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              responsive
              showTotal={total => <span style={{ fontSize: '18px' }}>共 {total} 个投票</span>}
              style={{ fontSize: '18px' }}
            />
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{ height: 120 }}
            description={<Text style={{ fontSize: '24px' }}>暂无投票数据</Text>} 
            style={{ fontSize: '18px' }}
          />
        </div>
      )}
    </div>
  );
};

export default VoteList; 