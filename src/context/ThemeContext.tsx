import React, { createContext, useContext, ReactNode } from 'react';
import { theme } from 'antd';

// 主题上下文接口
interface ThemeContextType {
  isDarkMode: boolean;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
});

// 主题提供者Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 固定为非暗色模式
  const isDarkMode = false;

  // 更新HTML元素主题类名
  document.documentElement.setAttribute('data-theme', 'light');
  // 更新系统状态栏颜色（移动设备）
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', '#ffffff');
  }

  // 提供上下文值
  const contextValue: ThemeContextType = {
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题的自定义Hook
export const useTheme = () => useContext(ThemeContext);

// 主题配置
export const getThemeToken = () => {
  // 抖音品牌颜色
  const brandRed = '#fe2c55'; // 抖音红
  const brandCyan = '#25f4ee'; // 抖音青

  // 抖音风格明亮主题配置
  return {
    algorithm: theme.defaultAlgorithm,
    token: {
      fontSize: 16,
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      borderRadius: 8,
      colorPrimary: brandRed,
      colorInfo: brandRed,
      colorSuccess: brandCyan,
      colorLink: brandRed,
      colorBgLayout: '#f8f8f8',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgSpotlight: brandRed,
      colorText: '#121212',
      colorTextSecondary: '#666666',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      sizeStep: 4,
      sizeUnit: 4,
      wireframe: false,
    },
    components: {
      Card: {
        padding: 24,
        borderRadius: 16,
        colorBgContainer: '#ffffff',
        boxShadowTertiary: '0 8px 24px rgba(0, 0, 0, 0.06)',
      },
      Form: {
        itemMarginBottom: 28,
        controlHeight: 48,
        fontSize: 16,
      },
      Button: {
        controlHeight: 48,
        paddingInline: 24,
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 8,
        primaryColor: '#ffffff',
        defaultColor: '#ffffff',
        defaultBg: '#f0f0f0',
        primaryShadow: '0 8px 16px rgba(254, 44, 85, 0.25)',
      },
      Input: {
        controlHeight: 48,
        paddingInline: 16,
        fontSize: 16,
        colorBgContainer: '#f8f8f8',
        borderRadius: 8,
      },
      Select: {
        controlHeight: 48,
        fontSize: 16,
        colorBgContainer: '#f8f8f8',
        borderRadius: 8,
      },
      Table: {
        fontSize: 16,
        padding: 16,
        colorBgContainer: '#ffffff',
        borderRadius: 12,
      },
      Typography: {
        fontSize: 16,
        fontWeightStrong: 600,
        titleMarginBottom: 16,
        titleMarginTop: 0,
        colorText: '#121212',
        colorTextSecondary: '#666666',
      },
      Modal: {
        borderRadiusLG: 16,
        paddingMD: 24,
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
      },
      Divider: {
        colorSplit: '#f0f0f0',
        marginLG: 32,
      },
      Tag: {
        colorBgContainer: '#f5f5f5',
        borderRadiusSM: 16,
        paddingXS: 12,
      },
      Radio: {
        borderRadius: 8,
        colorPrimary: brandRed,
      },
      Checkbox: {
        borderRadius: 4,
        colorPrimary: brandRed,
      },
      Tabs: {
        colorPrimary: brandRed,
        inkBarColor: brandRed,
        itemHoverColor: brandRed,
        itemSelectedColor: brandRed,
      },
      Menu: {
        itemBorderRadius: 8,
        itemSelectedBg: `rgba(254, 44, 85, 0.1)`,
        itemSelectedColor: brandRed,
        itemHoverBg: `rgba(254, 44, 85, 0.05)`,
        itemHoverColor: brandRed,
      },
      Layout: {
        colorBgHeader: '#ffffff',
        colorBgBody: '#f8f8f8',
        colorBgTrigger: '#ffffff',
      },
    },
  };
}; 