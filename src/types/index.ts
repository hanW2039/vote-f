// 选项类型
export interface VoteOption {
  id: number;
  vote_id: number;
  option_text: string;
  vote_count: number;
  percentage?: number;
}

// 投票类型
export interface Vote {
  id: number;
  title: string;
  question: string;
  vote_type: 'single' | 'multiple';
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
  options: VoteOption[];
  total_votes?: number;
  options_count?: number;
}

// 列表中的投票简略信息
export interface VoteListItem {
  id: number;
  title: string;
  question: string;
  vote_type: 'single' | 'multiple';
  start_time: string;
  end_time: string;
  options_count: number;
}

// 投票统计信息
export interface VoteStats {
  vote_id: number;
  title: string;
  question: string;
  total_votes: number;
  options: Array<{
    id: number;
    text: string;
    count: number;
    percentage: number;
  }>;
}

// 提交投票请求参数
export interface VoteSubmitRequest {
  option_ids: number | number[];
}

// API响应通用格式
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
} 