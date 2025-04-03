import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  Vote, 
  VoteListItem, 
  VoteStats, 
  VoteSubmitRequest 
} from '../types';

const API_BASE_URL = 'http://localhost:8888/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 处理响应数据
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  return response.data;
};

// 获取数据部分
const getData = <T>(apiResponse: ApiResponse<T>): T => {
  return apiResponse.data;
};

// 投票相关API
export const voteApi = {
  // 获取投票列表
  getVoteList: async (params?: { skip?: number; limit?: number; active_only?: boolean }): Promise<VoteListItem[]> => {
    const response = await apiClient.get<ApiResponse<VoteListItem[]>>('/votes', { params });
    return getData(handleResponse<VoteListItem[]>(response));
  },

  // 获取投票详情
  getVoteDetail: async (voteId: number): Promise<Vote> => {
    const response = await apiClient.get<ApiResponse<Vote>>(`/votes/${voteId}`);
    return getData(handleResponse<Vote>(response));
  },

  // 创建投票
  createVote: async (data: Omit<Vote, 'id' | 'created_at' | 'updated_at' | 'options'> & { options: string[] }): Promise<ApiResponse<Vote>> => {
    const response = await apiClient.post<ApiResponse<Vote>>('/votes', data);
    return handleResponse<Vote>(response);
  },

  // 更新投票
  updateVote: async (voteId: number, data: Partial<Vote>): Promise<ApiResponse<Vote>> => {
    const response = await apiClient.put<ApiResponse<Vote>>(`/votes/${voteId}`, data);
    return handleResponse<Vote>(response);
  },

  // 删除投票
  deleteVote: async (voteId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/votes/${voteId}`);
    return handleResponse<null>(response);
  },

  // 提交投票
  submitVote: async (voteId: number, data: VoteSubmitRequest): Promise<ApiResponse<VoteStats>> => {
    const response = await apiClient.post<ApiResponse<VoteStats>>(`/votes/${voteId}/submit`, data);
    return handleResponse<VoteStats>(response);
  },

  // 获取投票统计
  getVoteStats: async (voteId: number): Promise<VoteStats> => {
    const response = await apiClient.get<ApiResponse<VoteStats>>(`/votes/${voteId}/stats`);
    return getData(handleResponse<VoteStats>(response));
  },
};

// 系统健康状态检查
export const systemApi = {
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get<ApiResponse<{ status: string }>>('/health');
    return getData(handleResponse<{ status: string }>(response));
  },
}; 