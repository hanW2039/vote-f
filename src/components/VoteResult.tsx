import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Typography, Empty } from 'antd';
import { VoteStats } from '../types';

const { Title } = Typography;

interface VoteResultProps {
  stats: VoteStats | null;
}

const VoteResult: React.FC<VoteResultProps> = ({ stats }) => {
  if (!stats) {
    return <Empty description="暂无投票数据" />;
  }

  // 配置柱状图选项
  const getBarOptions = () => {
    return {
      title: {
        text: '投票结果统计',
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const option = stats.options[dataIndex];
          return `${option.text}: ${option.count}票 (${option.percentage.toFixed(2)}%)`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: stats.options.map(opt => {
          // 移动端显示时名称太长则截断
          const text = opt.text;
          return text.length > 6 ? text.slice(0, 6) + '...' : text;
        }),
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: '票数',
        nameTextStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '票数',
          type: 'bar',
          data: stats.options.map(opt => opt.count),
          itemStyle: {
            color: function(params: any) {
              // 为不同选项设置不同颜色
              const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
              return colorList[params.dataIndex % colorList.length];
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 12
          }
        }
      ]
    };
  };

  // 配置饼图选项
  const getPieOptions = () => {
    return {
      title: {
        text: '投票结果比例',
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}票 ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: stats.options.map(opt => opt.text),
        type: 'scroll',
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '投票比例',
          type: 'pie',
          radius: '55%',
          center: ['50%', '45%'],
          data: stats.options.map(opt => ({
            name: opt.text,
            value: opt.count
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {d}%',
            fontSize: 12
          }
        }
      ]
    };
  };

  return (
    <div style={{ marginTop: 24 }}>
      <Title level={4} style={{ fontSize: '18px' }}>实时投票结果（共 {stats.total_votes} 票）</Title>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ height: '350px', width: '100%' }}>
          <ReactECharts option={getBarOptions()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
        <div style={{ height: '350px', width: '100%' }}>
          <ReactECharts option={getPieOptions()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
      </div>
    </div>
  );
};

export default VoteResult; 