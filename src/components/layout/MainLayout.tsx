'use client';

import ErrorPage from '@/components/ui/ErrorPage';
import { useFinanceStore } from '@/lib/store';
import {
  BarChartOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TransactionOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 從 Store 獲取統計資料顯示在 Header
  const { getMonthlyStats, transactions } = useFinanceStore();
  const monthlyStats = getMonthlyStats();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '儀表板',
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: '收支管理',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '分析報表',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '設定',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 側邊選單 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#001529',
        }}
      >
        {/* Logo 區域 */}
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: borderRadiusLG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: collapsed ? '16px' : '18px',
          }}
        >
          <WalletOutlined style={{ marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && '小財'}
        </div>

        {/* 導航選單 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{
            border: 'none',
          }}
        />

        {/* 側邊統計資訊 */}
        {!collapsed && (
          <div
            style={{
              padding: 16,
              color: 'rgba(255, 255, 255, 0.7)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: '12px' }}>本月淨收入</div>
            <div
              style={{
                color: monthlyStats.net >= 0 ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {monthlyStats.net >= 0 ? '+' : ''}
              {monthlyStats.net.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', marginTop: 4 }}>
              共 {transactions.length} 筆交易
            </div>
          </div>
        )}
      </Sider>

      <Layout>
        {/* 頂部導航 */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />

            <div>
              <Text strong style={{ fontSize: '16px' }}>
                個人財務管理系統
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date().toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </Text>
            </div>
          </div>

          {/* 頂部統計快覽 */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginRight: 24,
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
                +{monthlyStats.income.toLocaleString()}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                本月收入
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                -{monthlyStats.expense.toLocaleString()}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                本月支出
              </Text>
            </div>
          </div>
        </Header>

        {/* 主要內容區 */}
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <ErrorPage>{children}</ErrorPage>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
