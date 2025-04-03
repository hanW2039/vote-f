import React, { useState } from 'react';
import { Form, Radio, Checkbox, Button, message, Typography } from 'antd';
import { Vote, VoteSubmitRequest } from '../types';
import { voteApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

interface VoteFormProps {
  vote: Vote;
  onVoteSubmitted: () => void;
}

const VoteForm: React.FC<VoteFormProps> = ({ vote, onVoteSubmitted }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
      const submitData: VoteSubmitRequest = {
        option_ids: values.options
      };
      
      await voteApi.submitVote(vote.id, submitData);
      message.success('投票提交成功');
      form.resetFields();
      onVoteSubmitted();
    } catch (error: unknown) {
      console.error('投票提交失败', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        message.error(error.response.data.message || '您已参与过此投票或选项无效');
      } else {
        message.error('投票提交失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 渲染单选表单
  const renderSingleChoiceForm = () => (
    <Form.Item 
      name="options" 
      rules={[{ required: true, message: '请选择一个选项' }]}
    >
      <Radio.Group style={{ width: '100%' }}>
        {vote.options.map(option => (
          <Radio 
            key={option.id} 
            value={option.id} 
            style={{ 
              display: 'block', 
              marginBottom: 16,
              height: 'auto',
              lineHeight: '32px'
            }}
          >
            {option.option_text}
          </Radio>
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
          <Checkbox 
            key={option.id} 
            value={option.id} 
            style={{ 
              display: 'block', 
              marginBottom: 16,
              height: 'auto',
              lineHeight: '32px'
            }}
          >
            {option.option_text}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );

  return (
    <div style={{ marginTop: 24 }}>
      <Title level={4} style={{ fontSize: '18px' }}>参与投票</Title>
      
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        disabled={isExpired}
        style={{ maxWidth: '100%' }}
        size="large"
      >
        {isSingleVote ? renderSingleChoiceForm() : renderMultipleChoiceForm()}
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={isExpired}
            size="large"
            style={{ minWidth: '120px' }}
          >
            提交投票
          </Button>
          {isExpired && <span style={{ marginLeft: 8, color: 'red', fontSize: '16px' }}>该投票已结束</span>}
        </Form.Item>
      </Form>
    </div>
  );
};

export default VoteForm; 