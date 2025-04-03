import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Typography, Empty, Card } from 'antd';
import { VoteStats } from '../types';
import type { EChartsOption } from 'echarts';

const { Title, Text } = Typography;

interface VoteResultProps {
  stats: VoteStats | null;
}

const VoteResult: React.FC<VoteResultProps> = ({ stats }) => {
  // 重新计算每个选项的百分比
  const optionsWithCalculatedPercentage = useMemo(() => {
    if (!stats || !stats.options || stats.options.length === 0) {
      return [];
    }

    const total = stats.total_votes;
    
    // 如果总票数为0，则所有选项的百分比都为0
    if (total === 0) {
      return stats.options.map(option => ({
        ...option,
        calculatedPercentage: 0
      }));
    }

    // 计算每个选项的百分比
    return stats.options.map(option => ({
      ...option,
      calculatedPercentage: (option.count / total) * 100
    }));
  }, [stats]);

  if (!stats) {
    return <Empty description={<Text style={{ fontSize: '22px' }}>暂无投票数据</Text>} />;
  }

  // 配置柱状图选项
  const getBarOptions = (): EChartsOption => {
    return {
      title: {
        text: '投票结果统计',
        left: 'center',
        textStyle: {
          fontSize: 24
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          if (Array.isArray(params) && params.length > 0 && typeof params[0].dataIndex === 'number') {
            const dataIndex = params[0].dataIndex;
            const option = optionsWithCalculatedPercentage[dataIndex];
            return `${option.text}: ${option.count}票 (${option.calculatedPercentage.toFixed(2)}%)`;
          }
          return '';
        },
        textStyle: {
          fontSize: 18
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '18%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: optionsWithCalculatedPercentage.map(opt => {
          // 移动端显示时名称太长则截断
          const text = opt.text;
          return text.length > 8 ? text.slice(0, 8) + '...' : text;
        }),
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 16,
          margin: 16
        }
      },
      yAxis: {
        type: 'value',
        name: '票数',
        nameTextStyle: {
          fontSize: 18,
          padding: [0, 0, 0, 40]
        },
        axisLabel: {
          fontSize: 16
        }
      },
      series: [
        {
          name: '票数',
          type: 'bar',
          barWidth: '50%',
          data: optionsWithCalculatedPercentage.map(opt => opt.count),
          itemStyle: {
            color: function(params) {
              // 为不同选项设置不同颜色
              const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
              return colorList[params.dataIndex % colorList.length];
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  // 配置饼图选项
  const getPieOptions = (): EChartsOption => {
    return {
      title: {
        text: '投票结果比例',
        left: 'center',
        textStyle: {
          fontSize: 24
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}票 ({d}%)',
        textStyle: {
          fontSize: 18
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: optionsWithCalculatedPercentage.map(opt => opt.text),
        type: 'scroll',
        textStyle: {
          fontSize: 16
        },
        padding: [20, 0, 0, 0]
      },
      series: [
        {
          name: '投票比例',
          type: 'pie',
          radius: '65%',
          center: ['50%', '45%'],
          data: optionsWithCalculatedPercentage.map(opt => ({
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
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  return (
    <div style={{ marginTop: 40 }}>
      <Title level={2} style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>
        实时投票结果（共 {stats.total_votes} 票）
      </Title>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Card bodyStyle={{ padding: '30px' }} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <div style={{ height: '500px', width: '100%' }}>
            <ReactECharts 
              option={getBarOptions()} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </Card>
        
        <Card bodyStyle={{ padding: '30px' }} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <div style={{ height: '500px', width: '100%' }}>
            <ReactECharts 
              option={getPieOptions()} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoteResult; 