import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { theme } from 'antd';

// 主题类型
export type ThemeType = 'dark' | 'light';

// 主题上下文接口
interface ThemeContextType {
  themeType: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType>({
  themeType: 'dark',
  toggleTheme: () => {},
  isDarkMode: true,
});

// 主题提供者Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储获取主题设置，默认为暗色主题
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'dark';
  });

  // 切换主题
  const toggleTheme = () => {
    setThemeType(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // 判断是否为暗色模式
  const isDarkMode = themeType === 'dark';

  // 更新HTML元素主题类名
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeType);
    // 更新系统状态栏颜色（移动设备）
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDarkMode ? '#121212' : '#ffffff'
      );
    }
  }, [themeType, isDarkMode]);

  // 提供上下文值
  const contextValue: ThemeContextType = {
    themeType,
    toggleTheme,
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
export const getThemeToken = (themeType: ThemeType) => {
  // 共享颜色
  const brandRed = '#fe2c55'; // 抖音红
  const brandCyan = '#25f4ee'; // 抖音青

  // 深色主题配置
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      fontSize: 18,
      borderRadius: 8,
      colorPrimary: brandRed,
      colorInfo: brandRed,
      colorSuccess: brandCyan,
      colorLink: brandRed,
      colorBgLayout: '#000000',
      colorBgContainer: '#121212',
      colorBgElevated: '#1f1f1f',
      colorBgSpotlight: brandRed,
      colorText: '#ffffff',
      colorTextSecondary: '#aaaaaa',
      colorBgMask: 'rgba(0, 0, 0, 0.7)',
      sizeStep: 6,
      sizeUnit: 6,
      wireframe: false,
    },
    components: {
      Card: {
        padding: 24,
        borderRadius: 12,
        colorBgContainer: '#1a1a1a',
        boxShadowTertiary: '0 8px 16px rgba(0, 0, 0, 0.6)',
      },
      Form: {
        itemMarginBottom: 28,
        controlHeight: 48,
        fontSize: 16,
      },
      Button: {
        controlHeight: 48,
        paddingInline: 24,
        fontSize: 18,
        borderRadius: 12,
        primaryColor: '#ffffff',
        primaryShadow: '0 8px 16px rgba(254, 44, 85, 0.4)',
      },
      Input: {
        controlHeight: 48,
        paddingInline: 16,
        fontSize: 16,
        colorBgContainer: '#2a2a2a',
      },
      Select: {
        controlHeight: 48,
        fontSize: 16,
        colorBgContainer: '#2a2a2a',
      },
      Table: {
        fontSize: 16,
        padding: 16,
        colorBgContainer: '#1a1a1a',
      },
      Typography: {
        fontSize: 18,
        colorText: '#ffffff',
        colorTextSecondary: '#aaaaaa',
      },
      Modal: {
        borderRadiusLG: 16,
        colorBgContainer: '#1a1a1a',
        colorBgElevated: '#1a1a1a',
      },
      Divider: {
        colorSplit: '#333333',
      },
      Tag: {
        colorBgContainer: '#252525',
      },
    },
  };

  // 明亮主题配置
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      fontSize: 18,
      borderRadius: 8,
      colorPrimary: brandRed,
      colorInfo: brandRed,
      colorSuccess: brandCyan,
      colorLink: brandRed,
      colorBgLayout: '#f8f8f8',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgSpotlight: brandRed,
      colorText: '#222222',
      colorTextSecondary: '#666666',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      sizeStep: 6,
      sizeUnit: 6,
      wireframe: false,
    },
    components: {
      Card: {
        padding: 24,
        borderRadius: 12,
        colorBgContainer: '#ffffff',
        boxShadowTertiary: '0 8px 16px rgba(0, 0, 0, 0.08)',
      },
      Form: {
        itemMarginBottom: 28,
        controlHeight: 48,
        fontSize: 16,
      },
      Button: {
        controlHeight: 48,
        paddingInline: 24,
        fontSize: 18,
        borderRadius: 12,
        primaryColor: '#ffffff',
        primaryShadow: '0 8px 16px rgba(254, 44, 85, 0.2)',
      },
      Input: {
        controlHeight: 48,
        paddingInline: 16,
        fontSize: 16,
        colorBgContainer: '#f5f5f5',
      },
      Select: {
        controlHeight: 48,
        fontSize: 16,
        colorBgContainer: '#f5f5f5',
      },
      Table: {
        fontSize: 16,
        padding: 16,
        colorBgContainer: '#ffffff',
      },
      Typography: {
        fontSize: 18,
        colorText: '#222222',
        colorTextSecondary: '#666666',
      },
      Modal: {
        borderRadiusLG: 16,
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
      },
      Divider: {
        colorSplit: '#eeeeee',
      },
      Tag: {
        colorBgContainer: '#f5f5f5',
      },
    },
  };

  return themeType === 'dark' ? darkTheme : lightTheme;
}; 