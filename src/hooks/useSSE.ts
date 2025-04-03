import { useEffect, useState } from 'react';
import { sseManager } from '../services/sseService';
import { VoteStats } from '../types';

/**
 * 自定义Hook，用于在组件中订阅投票的实时数据
 * @param voteId 投票ID
 * @returns 实时更新的投票统计数据
 */
export function useSSE(voteId: number): VoteStats | null {
  const [stats, setStats] = useState<VoteStats | null>(null);
  
  useEffect(() => {
    if (voteId) {
      // 数据更新回调函数
      const handleUpdate = (data: VoteStats) => {
        setStats(data);
      };
      
      // 添加监听器
      sseManager.addListener(handleUpdate);
      
      // 连接SSE
      sseManager.connect(voteId);
      
      // 清理函数
      return () => {
        sseManager.removeListener(handleUpdate);
        sseManager.disconnect();
      };
    }
  }, [voteId]);
  
  return stats;
} 