import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Layout, Typography, ConfigProvider } from 'antd'
import VoteList from './pages/VoteList'
import VoteDetail from './pages/VoteDetail'
import './App.css'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme, getThemeToken } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'

const { Header, Content, Footer } = Layout

// 动画路由组件
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<VoteList />} />
        <Route path="/vote/:id" element={<VoteDetail />} />
      </Routes>
    </AnimatePresence>
  );
};

// 应用主体内容
const AppContent = () => {
  const { themeType } = useTheme();
  
  return (
    <ConfigProvider theme={getThemeToken(themeType)}>
      <Router>
        <Layout 
          style={{ 
            minHeight: '100vh', 
            width: '100vw', 
            maxWidth: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            background: themeType === 'dark' ? '#000000' : '#f8f8f8'
          }}
        >
          <Header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 36px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            height: '80px',
            width: '100%',
            margin: 0,
            background: themeType === 'dark' ? '#121212' : '#ffffff',
            borderBottom: themeType === 'dark' ? '1px solid #333' : '1px solid #eee'
          }}>
            <Typography.Title level={3} style={{ color: '#fe2c55', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
              抖声投票
            </Typography.Title>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ThemeToggle />
              
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'linear-gradient(to right, #fe2c55, #25f4ee)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>V</span>
              </div>
            </div>
          </Header>
          <Content style={{ 
            padding: 0, 
            margin: 0, 
            flex: 1, 
            width: '100%', 
            maxWidth: '100%',
            overflow: 'auto',
            background: themeType === 'dark' ? '#000000' : '#f8f8f8'
          }}>
            <div style={{ 
              padding: 0, 
              minHeight: 'calc(100vh - 160px)', 
              borderRadius: 0,
              width: '100%',
              margin: 0
            }}>
              <AnimatedRoutes />
            </div>
          </Content>
          <Footer style={{ 
            textAlign: 'center', 
            padding: '20px 0', 
            fontSize: '16px', 
            width: '100%',
            margin: 0,
            background: themeType === 'dark' ? '#121212' : '#ffffff',
            color: themeType === 'dark' ? '#aaaaaa' : '#666666',
            borderTop: themeType === 'dark' ? '1px solid #333' : '1px solid #eee'
          }}>
            抖声投票 ©{new Date().getFullYear()} Created by Your Team
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
