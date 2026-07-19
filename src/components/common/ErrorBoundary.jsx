'use client'

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[--bg-page] px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-lg font-heading font-bold text-[--text-heading] mb-2">Something went wrong</h2>
            <p className="text-sm text-[--text-secondary] mb-6">
              {this.props.fallbackMessage || 'An unexpected error occurred. Try refreshing the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
