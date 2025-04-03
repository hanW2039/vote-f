import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout, Typography, ConfigProvider } from 'antd'
import VoteList from './pages/VoteList'
import VoteDetail from './pages/VoteDetail'
import './App.css'

const { Header, Content, Footer } = Layout

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
          borderRadius: 8,
          colorPrimary: '#1677ff',
          sizeStep: 6,
          sizeUnit: 6,
        },
        components: {
          Card: {
            padding: 24,
            borderRadius: 8,
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
          },
          Input: {
            controlHeight: 48,
            paddingInline: 16,
            fontSize: 16,
          },
          Select: {
            controlHeight: 48,
            fontSize: 16,
          },
          Table: {
            fontSize: 16,
            padding: 16,
          },
          Typography: {
            fontSize: 18,
          },
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh', width: '100vw', maxWidth: '100%' }}>
          <Header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 36px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            height: '80px',
            width: '100%'
          }}>
            <Typography.Title level={3} style={{ color: 'white', margin: 0, fontSize: '32px' }}>
              实时投票系统
            </Typography.Title>
          </Header>
          <Content style={{ padding: '32px', margin: '0', flex: 1, width: '100%', maxWidth: '100%' }}>
            <div style={{ 
              background: '#fff', 
              padding: 0, 
              minHeight: 'calc(100vh - 220px)', 
              borderRadius: 8,
              width: '100%',
              maxWidth: '1800px',
              margin: '0 auto'
            }}>
              <Routes>
                <Route path="/" element={<VoteList />} />
                <Route path="/vote/:id" element={<VoteDetail />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', padding: '20px 0', fontSize: '18px', width: '100%' }}>
            实时投票系统 ©{new Date().getFullYear()} Created by Your Team
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
