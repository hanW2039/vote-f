import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  style?: React.CSSProperties;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? '切换到明亮模式' : '切换到暗黑模式'}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={style}
      >
        <Button
          type="text"
          shape="circle"
          icon={
            isDarkMode ? (
              <BulbOutlined style={{ fontSize: '20px' }} />
            ) : (
              <BulbFilled style={{ fontSize: '20px' }} />
            )
          }
          onClick={toggleTheme}
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: isDarkMode ? '#ffeb3b' : '#fe2c55',
          }}
        />
      </motion.div>
    </Tooltip>
  );
};

export default ThemeToggle; 