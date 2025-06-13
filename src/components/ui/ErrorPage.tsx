'use client'; //Next.js App Router 的指令，因為 ErrorBoundary 使用了瀏覽器 API（如 console.error），只能在客戶端運行

import { Button, Result } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react'; //ReactNode - TypeScript 型別，像 vue 的 slot，可以接受任何內容(文字、數字、組件、多個元素、空值)

interface Props {
  children: ReactNode;
  fallback?: ReactNode; //可選的自定義錯誤顯示內容（? 表示可選）
}

interface State {
  hasError: boolean;
  error?: Error; // 可選的錯誤物件，用來儲存具體的錯誤資訊
}

class ErrorPage extends Component<Props, State> {
  // 繼承 React 的 Component 類
  // <Props, State> 是 TypeScript 泛型，指定組件的 props 和 state 型別

  constructor(props: Props) {
    //組件初始化時執行
    super(props); //調用父類（Component）的建構函式
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('捕捉到錯誤啦~~', error, errorInfo);
  }
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          status="error"
          title="錯誤出現啦!!!"
          subTitle="QWQQQQ"
          extra={[
            <Button type="primary" onClick={this.handleRetry} key="retry">
              再試一次
            </Button>,
          ]}
        ></Result>
      );
    }

    return this.props.children;
  }
}

export default ErrorPage;
