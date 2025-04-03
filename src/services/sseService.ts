import { VoteStats } from '../types';

const API_BASE_URL = 'http://localhost:8888/api/v1';

export class SSEManager {
  private eventSource: EventSource | null = null;
  private listeners: Array<(data: VoteStats) => void> = [];
  private isConnected = false;
  private voteId: number | null = null;

  // 连接到SSE服务
  connect(voteId: number): void {
    if (this.isConnected && this.voteId === voteId) {
      return;
    }

    // 如果已有连接，先关闭
    this.disconnect();

    this.voteId = voteId;
    const url = `${API_BASE_URL}/votes/${voteId}/sse`;
    this.eventSource = new EventSource(url);
    
    // 处理连接打开
    this.eventSource.onopen = () => {
      this.isConnected = true;
      console.log(`SSE连接已建立: ${url}`);
    };

    // 处理初始数据
    this.eventSource.addEventListener('initial', (event) => {
      const data = JSON.parse(event.data) as VoteStats;
      this.notifyListeners(data);
    });

    // 处理更新数据
    this.eventSource.addEventListener('update', (event) => {
      const data = JSON.parse(event.data) as VoteStats;
      this.notifyListeners(data);
    });

    // 处理错误
    this.eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error);
      this.disconnect();
      
      // 尝试重新连接
      setTimeout(() => {
        if (this.voteId !== null) {
          this.connect(this.voteId);
        }
      }, 3000);
    };
  }

  // 断开SSE连接
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      this.voteId = null;
      console.log('SSE连接已关闭');
    }
  }

  // 添加数据监听器
  addListener(callback: (data: VoteStats) => void): void {
    this.listeners.push(callback);
  }

  // 移除数据监听器
  removeListener(callback: (data: VoteStats) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // 通知所有监听器
  private notifyListeners(data: VoteStats): void {
    this.listeners.forEach(listener => listener(data));
  }
}

// 创建单例实例
export const sseManager = new SSEManager(); 