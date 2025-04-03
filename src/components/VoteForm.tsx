import React, { useState } from 'react';
import { Form, Radio, Checkbox, Button, Typography, Card } from 'antd';
import { Vote, VoteSubmitRequest } from '../types';
import { voteApi } from '../services/api';
import axios from 'axios';
import MessageModal from '../components/MessageModal';

const { Title, Text } = Typography;

interface VoteFormProps {
  vote: Vote;
  onVoteSubmitted: () => void;
}

const VoteForm: React.FC<VoteFormProps> = ({ vote, onVoteSubmitted }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isSingleVote = vote.vote_type === 'single';
  const isExpired = new Date(vote.end_time) < new Date();
  const [messageModal, setMessageModal] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  
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
  
  // 处理提交投票
  const handleSubmit = async (values: { options: number | number[] }) => {
    if (isExpired) {
      showMessageModal('该投票已结束，无法提交', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const submitData: VoteSubmitRequest = {
        option_ids: values.options
      };
      
      const response = await voteApi.submitVote(vote.id, submitData);
      
      // 使用API返回的消息
      if (response.success) {
        showMessageModal(response.message || '投票提交成功', 'success');
        form.resetFields();
        onVoteSubmitted();
      } else {
        showMessageModal(response.message || '投票提交失败，请稍后重试', 'error');
      }
    } catch (error: unknown) {
      console.error('投票提交失败', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showMessageModal(error.response.data.message || '您已参与过此投票或选项无效', 'error');
      } else {
        showMessageModal('投票提交失败，请稍后重试', 'error');
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

  return (
    <div style={{ marginTop: 36 }}>
      <Title level={2} style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>参与投票</Title>
      
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        disabled={isExpired}
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
      
      <MessageModal
        visible={messageModal.visible}
        message={messageModal.message}
        type={messageModal.type}
        onClose={closeMessageModal}
      />
    </div>
  );
};

export default VoteForm; 