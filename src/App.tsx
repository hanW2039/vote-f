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
            cellPadding: 16,
          },
          Typography: {
            fontSize: 18,
          },
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}>
            <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
              实时投票系统
            </Typography.Title>
          </Header>
          <Content style={{ padding: '16px', margin: '0' }}>
            <div style={{ 
              background: '#fff', 
              padding: 0, 
              minHeight: 280, 
              borderRadius: 4 
            }}>
              <Routes>
                <Route path="/" element={<VoteList />} />
                <Route path="/vote/:id" element={<VoteDetail />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', padding: '12px 0' }}>
            实时投票系统 ©{new Date().getFullYear()} Created by Your Team
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
