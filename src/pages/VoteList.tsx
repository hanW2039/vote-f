import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin, Empty, Pagination, Switch, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { VoteListItem } from '../types';
import { voteApi } from '../services/api';
import VoteItem from '../components/VoteItem';

const { Title } = Typography;

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
    <div style={{ padding: '16px 12px' }}>
      <Title level={2} style={{ fontSize: '26px', marginBottom: '20px' }}>投票列表</Title>
      
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px'
      }}>
        <Space>
          <Switch 
            checked={activeOnly} 
            onChange={setActiveOnly} 
            checkedChildren="仅显示进行中" 
            unCheckedChildren="显示所有" 
          />
        </Space>
        
        <Input 
          placeholder="搜索投票标题或问题" 
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: '500px' }}
          prefix={<SearchOutlined />}
          allowClear
          size="large"
        />
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredVotes.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {filteredVotes.map(vote => (
              <Col xs={24} sm={24} md={12} lg={8} xl={8} key={vote.id}>
                <VoteItem vote={vote} />
              </Col>
            ))}
          </Row>
          
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              responsive
              showTotal={total => `共 ${total} 个投票`}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无投票数据" />
      )}
    </div>
  );
};

export default VoteList; 