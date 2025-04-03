import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Layout, Typography, ConfigProvider } from 'antd'
import VoteList from './pages/VoteList'
import VoteDetail from './pages/VoteDetail'
import './App.css'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider, getThemeToken } from './context/ThemeContext'

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
  return (
    <ConfigProvider theme={getThemeToken()}>
      <Router>
        <Layout 
          style={{ 
            minHeight: '100vh', 
            width: '100vw', 
            maxWidth: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            background: '#f8f8f8'
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
            background: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  boxShadow: '0 4px 10px rgba(254, 44, 85, 0.3)'
                }}>
                  <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>V</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography.Title level={3} style={{ 
                  margin: 0, 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(254, 44, 85, 0.2)'
                }}>
                  实时投票
                </Typography.Title>
              </motion.div>
            </div>
            
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(254, 44, 85, 0.3)',
                cursor: 'pointer'
              }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>+</span>
              </div>
            </motion.div>
          </Header>
          <Content style={{ 
            padding: 0, 
            margin: 0, 
            flex: 1, 
            width: '100%', 
            maxWidth: '100%',
            overflow: 'auto',
            background: '#f8f8f8',
            position: 'relative'
          }}>
            {/* 背景装饰元素 */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(254, 44, 85, 0.05), rgba(37, 244, 238, 0.05))',
              filter: 'blur(60px)',
              zIndex: 0
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(37, 244, 238, 0.05), rgba(254, 44, 85, 0.05))',
              filter: 'blur(80px)',
              zIndex: 0
            }} />
            
            <div style={{ 
              padding: 0, 
              minHeight: 'calc(100vh - 160px)', 
              borderRadius: 0,
              width: '100%',
              margin: 0,
              position: 'relative',
              zIndex: 1
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
            background: '#ffffff',
            color: '#666666',
            borderTop: '1px solid #f0f0f0'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{ 
                background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                实时投票
              </span> ©{new Date().getFullYear()} Created by Your Team
            </motion.div>
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
