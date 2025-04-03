import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface MessageModalProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  message,
  type,
  visible,
  onClose,
}) => {
  useEffect(() => {
    let timer: number | undefined;
    if (visible) {
      timer = window.setTimeout(() => {
        onClose();
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, onClose]);

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      maskClosable={true}
      onCancel={onClose}
      width={400}
      bodyStyle={{
        padding: '30px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        {type === 'success' ? (
          <CheckCircleFilled 
            style={{ 
              fontSize: 48, 
              color: '#25f4ee',
              background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} 
          />
        ) : (
          <CloseCircleFilled style={{ fontSize: 48, color: '#fe2c55' }} />
        )}
      </div>
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '16px',
        }}
      >
        {message}
      </div>
    </Modal>
  );
};

export default MessageModal; 