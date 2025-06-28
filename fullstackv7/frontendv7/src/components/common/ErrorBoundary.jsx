// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';
import { useAppStore } from '../../store/appStore';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   * @param {Error} error - The error that was thrown
   * @returns {Object} - New state object
   */
  static getDerivedStateFromError(_error) {
    return {
      hasError: true,
      errorId: Date.now() + Math.random(),
    };
  }

  /**
   * Log error details and add to global error store
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (
      typeof window !== 'undefined' &&
      window.location?.hostname === 'localhost'
    ) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Add error to global store
    const addError = useAppStore.getState().addError;
    addError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      source: this.props.source || 'Unknown Component',
      timestamp: new Date().toISOString(),
    });

    // Update component state
    this.setState({
      error,
      errorInfo,
    }); // Report error to external service in production
    if (
      typeof window !== 'undefined' &&
      window.location?.hostname !== 'localhost'
    ) {
      this.reportErrorToService(error, errorInfo);
    }
  }

  /**
   * Report error to external monitoring service
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace
   */ reportErrorToService(_error, _errorInfo) {
    // Implementation for error reporting service (e.g., Sentry, LogRocket)
    // TODO: Implement error reporting to external service
  }

  /**
   * Reset error boundary state
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * Reload the current page
   */
  reloadPage = () => {
    window.location.reload();
  };

  /**
   * Navigate to home page
   */
  goHome = () => {
    window.location.href = '/';
  };

  /**
   * Render error icon
   */
  renderErrorIcon = () => (
    <div className='flex justify-center mb-6'>
      <div className='bg-red-100 rounded-full p-4'>
        <AlertTriangle className='w-8 h-8 text-red-600' />
      </div>
    </div>
  );

  /**
   * Render error message
   */
  renderErrorMessage = () => {
    const { level = 'component' } = this.props;
    return (
      <>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          {level === 'app' ? 'Ứng dụng gặp sự cố' : 'Đã có lỗi xảy ra'}
        </h1>
        <p className='text-gray-600 mb-6'>
          {level === 'app'
            ? 'Xin lỗi, ứng dụng đã gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ kỹ thuật.'
            : 'Một phần của trang web gặp sự cố. Vui lòng thử lại hoặc làm mới trang.'}
        </p>
      </>
    );
  };

  /**
   * Render error details for development
   */
  renderErrorDetails = () => {
    const { showDetails = false } = this.props;
    const { error, errorInfo } = this.state;

    if (
      !showDetails ||
      !error ||
      typeof window === 'undefined' ||
      window.location?.hostname !== 'localhost'
    ) {
      return null;
    }

    return (
      <details className='mb-6 text-left'>
        <summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
          Chi tiết lỗi (Development)
        </summary>
        <div className='bg-gray-100 rounded p-3 text-xs font-mono'>
          <div className='mb-2'>
            <strong>Error:</strong> {error.message}
          </div>
          {errorInfo && (
            <div>
              <strong>Component Stack:</strong>
              <pre className='whitespace-pre-wrap text-red-600'>
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  /**
   * Render action buttons
   */
  renderActionButtons = () => {
    const { level = 'component' } = this.props;
    return (
      <div className='space-y-3'>
        <Button
          onClick={this.resetErrorBoundary}
          variant='primary'
          className='w-full'
        >
          <RefreshCw className='w-4 h-4 mr-2' />
          Thử lại
        </Button>

        {level === 'app' && (
          <Button
            onClick={this.reloadPage}
            variant='outline'
            className='w-full'
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            Tải lại trang
          </Button>
        )}

        <Button onClick={this.goHome} variant='outline' className='w-full'>
          <Home className='w-4 h-4 mr-2' />
          Về trang chủ
        </Button>
      </div>
    );
  };

  /**
   * Render support information
   */
  renderSupportInfo = () => (
    <div className='mt-6 pt-6 border-t border-gray-200'>
      <p className='text-sm text-gray-500'>
        Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ{' '}
        <a
          href='mailto:support@blooddonation.com'
          className='text-red-600 hover:underline'
        >
          hỗ trợ kỹ thuật
        </a>
      </p>
      {this.state.errorId && (
        <p className='text-xs text-gray-400 mt-2'>
          Mã lỗi: {this.state.errorId}
        </p>
      )}
    </div>
  );

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback(this.state.error, this.resetErrorBoundary);
      }

      // Default fallback UI based on error level
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
          <div className='max-w-md w-full'>
            <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
              {/* Error Icon */}
              {this.renderErrorIcon()}

              {/* Error Message */}
              {this.renderErrorMessage()}

              {/* Error Details (Development Mode) */}
              {this.renderErrorDetails()}

              {/* Action Buttons */}
              {this.renderActionButtons()}

              {/* Support Information */}
              {this.renderSupportInfo()}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * HOC to wrap components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props for ErrorBoundary
 * @returns {React.Component} - Wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = React.forwardRef((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Hook to throw errors in functional components that will be caught by ErrorBoundary
 * @returns {Function} - Function to throw errors that will be caught by ErrorBoundary
 */
export const useErrorThrower = () => {
  const [, setState] = React.useState();
  return React.useCallback(error => {
    setState(() => {
      throw error;
    });
  }, []);
};

export default ErrorBoundary;
