import React, { useState } from 'react';
import { Form, Radio, Checkbox, Button, message, Typography, Card, Modal, Descriptions, Tag, Result, Space } from 'antd';
import { Vote, VoteSubmitRequest, VoteStats } from '../types';
import { voteApi } from '../services/api';
import axios from 'axios';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface VoteFormProps {
  vote: Vote;
  onVoteSubmitted: () => void;
}

const VoteForm: React.FC<VoteFormProps> = ({ vote, onVoteSubmitted }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<VoteStats | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseStatus, setResponseStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isSingleVote = vote.vote_type === 'single';
  const isExpired = new Date(vote.end_time) < new Date();
  
  // 处理提交投票
  const handleSubmit = async (values: { options: number | number[] }) => {
    if (isExpired) {
      message.error('该投票已结束，无法提交');
      return;
    }
    
    try {
      setLoading(true);
      setResponseStatus('loading');
      const submitData: VoteSubmitRequest = {
        option_ids: values.options
      };
      
      // 打开模态框先显示加载状态
      setShowResponseModal(true);
      
      const response = await voteApi.submitVote(vote.id, submitData);
      
      // 保存响应数据并更新状态
      setResponseData(response);
      setResponseStatus('success');
      message.success('投票提交成功');
      form.resetFields();
      
      // 通知父组件更新
      onVoteSubmitted();
    } catch (error: unknown) {
      console.error('投票提交失败', error);
      setResponseStatus('error');
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        // 特别处理 400 错误，这通常是重复投票或选项无效
        if (status === 400) {
          const errorMsg = errorData?.message || '您已经参与过此投票，不能重复提交';
          setErrorMessage(errorMsg);
          message.error(errorMsg);
        } 
        // 处理 403 错误，可能是权限问题
        else if (status === 403) {
          const errorMsg = errorData?.message || '您没有权限进行此操作';
          setErrorMessage(errorMsg);
          message.error(errorMsg);
        }
        // 处理其他API错误
        else if (errorData) {
          const errorMsg = errorData.message || '投票提交失败，请稍后重试';
          setErrorMessage(errorMsg);
          message.error(errorMsg);
        } else {
          setErrorMessage('服务器返回错误，请稍后重试');
          message.error('服务器返回错误，请稍后重试');
        }
      } else {
        setErrorMessage('网络异常或服务器错误，请稍后重试');
        message.error('投票提交失败，请稍后重试');
      }
      
      // 仍然显示模态框，但显示错误信息
      setShowResponseModal(true);
    } finally {
      setLoading(false);
    }
  };
  
  // 关闭响应数据模态框
  const handleCloseModal = () => {
    setShowResponseModal(false);
  };
  
  // 渲染单选表单
  const renderSingleChoiceForm = () => (
    <Form.Item 
      name="options" 
      rules={[{ required: true, message: '请选择一个选项' }]}
    >
      <Radio.Group style={{ width: '100%' }}>
        {vote.options.map(option => (
          <Card
            key={option.id}
            style={{ 
              marginBottom: 24, 
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            bodyStyle={{ padding: '18px 24px' }}
            hoverable
          >
            <Radio 
              value={option.id} 
              style={{ 
                width: '100%',
                height: 'auto',
                lineHeight: '1.6',
                fontSize: '22px',
                padding: '10px 0'
              }}
            >
              {option.option_text}
            </Radio>
          </Card>
        ))}
      </Radio.Group>
    </Form.Item>
  );
  
  // 渲染多选表单
  const renderMultipleChoiceForm = () => (
    <Form.Item 
      name="options" 
      rules={[{ required: true, message: '请至少选择一个选项' }]}
    >
      <Checkbox.Group style={{ width: '100%' }}>
        {vote.options.map(option => (
          <Card
            key={option.id}
            style={{ 
              marginBottom: 24, 
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            bodyStyle={{ padding: '18px 24px' }}
            hoverable
          >
            <Checkbox 
              value={option.id} 
              style={{ 
                width: '100%',
                height: 'auto',
                lineHeight: '1.6',
                fontSize: '22px',
                padding: '10px 0'
              }}
            >
              {option.option_text}
            </Checkbox>
          </Card>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );

  // 渲染响应数据展示模态框
  const renderResponseModal = () => {
    // 加载状态
    if (responseStatus === 'loading') {
      return (
        <Modal
          title={<Title level={3}>处理中</Title>}
          open={showResponseModal}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
        >
          <Result
            icon={<LoadingOutlined style={{ fontSize: 64, color: '#1677ff' }} />}
            title="正在提交您的投票"
            subTitle="请稍候，正在与服务器通信中..."
          />
        </Modal>
      );
    }
    
    // 错误状态
    if (responseStatus === 'error') {
      return (
        <Modal
          title={<Title level={3} style={{ color: '#ff4d4f' }}>提交失败</Title>}
          open={showResponseModal}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" danger onClick={handleCloseModal} size="large">
              关闭
            </Button>
          ]}
          width={600}
        >
          <Result
            status="error"
            title="投票提交失败"
            subTitle={
              <div style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: 'bold' }}>
                {errorMessage}
              </div>
            }
          />
        </Modal>
      );
    }
    
    // 成功状态
    if (responseStatus === 'success' && responseData) {
      return (
        <Modal
          title={
            <Space>
              <Title level={3}>投票成功</Title>
              <Tag color="success" icon={<CheckCircleOutlined />}>请求成功</Tag>
            </Space>
          }
          open={showResponseModal}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" type="primary" onClick={handleCloseModal} size="large">
              关闭
            </Button>
          ]}
          width={800}
        >
          <Descriptions 
            bordered 
            column={1} 
            size="middle" 
            style={{ marginTop: 20 }}
            labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
            contentStyle={{ fontSize: '16px' }}
          >
            <Descriptions.Item label="投票ID">{responseData.vote_id}</Descriptions.Item>
            <Descriptions.Item label="标题">{responseData.title}</Descriptions.Item>
            <Descriptions.Item label="问题">{responseData.question}</Descriptions.Item>
            <Descriptions.Item label="总票数">
              <Tag color="blue" style={{ fontSize: '16px', padding: '4px 8px' }}>
                {responseData.total_votes} 票
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="选项信息">
              <div style={{ marginLeft: 20 }}>
                {responseData.options.map((option, index) => (
                  <div key={option.id} style={{ margin: '12px 0', fontSize: '16px' }}>
                    {index + 1}. {option.text}
                    <Tag color="blue" style={{ marginLeft: 10 }}>{option.count}票</Tag>
                    <Tag color="green">{option.percentage.toFixed(2)}%</Tag>
                  </div>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
          
          <div style={{ marginTop: 30 }}>
            <Paragraph strong style={{ fontSize: '18px', marginBottom: 10 }}>后端响应数据：</Paragraph>
            <Card 
              size="small" 
              title="JSON响应" 
              style={{ background: '#f5f5f5', borderRadius: 8 }}
              headStyle={{ background: '#e6f4ff', fontWeight: 'bold' }}
            >
              <pre style={{ 
                overflowX: 'auto',
                fontSize: '16px',
                lineHeight: 1.6 
              }}>
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </Card>
          </div>
        </Modal>
      );
    }
    
    return null;
  };

  return (
    <div style={{ marginTop: 36 }}>
      <Title level={2} style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>参与投票</Title>
      
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        disabled={isExpired || loading}
        style={{ maxWidth: '100%' }}
        size="large"
      >
        {isSingleVote ? renderSingleChoiceForm() : renderMultipleChoiceForm()}
        
        <Form.Item style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={isExpired}
            size="large"
            style={{ 
              minWidth: '240px', 
              height: '60px', 
              fontSize: '22px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}
          >
            提交投票
          </Button>
          {isExpired && (
            <div style={{ marginTop: 20 }}>
              <Text style={{ color: 'red', fontSize: '22px', fontWeight: 'bold' }}>该投票已结束</Text>
            </div>
          )}
        </Form.Item>
      </Form>
      
      {renderResponseModal()}
    </div>
  );
};

export default VoteForm; 