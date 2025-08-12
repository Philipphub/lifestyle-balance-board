'use client'

import { useState } from 'react'
import { ApiService, type ApiResponse, type HealthResponse } from '@/services/api'

type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

interface ApiTestComponentProps {
  className?: string
}

export function ApiTestComponent({ className }: ApiTestComponentProps) {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle')
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testApiConnection = async () => {
    setApiStatus('loading')
    setError(null)
    setApiData(null)
    setHealthData(null)
    
    try {
      const result = await ApiService.testConnection()
      setApiData(result.apiInfo)
      setHealthData(result.healthCheck)
      setApiStatus('success')
    } catch (err) {
      setApiStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    }
  }

  return (
    <div className={`w-full max-w-md ${className || ''}`} data-testid="api-test-component">
      <h2 className="text-xl font-semibold mb-4">Backend API Test</h2>
      
      <button
        onClick={testApiConnection}
        disabled={apiStatus === 'loading'}
        className="w-full rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="test-connection-button"
      >
        {apiStatus === 'loading' ? 'Testing Connection...' : 'Test Backend Connection'}
      </button>

      {apiStatus === 'success' && apiData && (
        <div 
          className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          data-testid="success-message"
        >
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Connection Successful!</h3>
          <div className="text-sm text-green-700 dark:text-green-300">
            <p data-testid="api-message"><strong>Message:</strong> {apiData.message}</p>
            <p data-testid="api-version"><strong>Version:</strong> {apiData.version}</p>
            <p data-testid="backend-url"><strong>Backend URL:</strong> {ApiService.getBaseUrl()}</p>
            {healthData && (
              <>
                <p data-testid="health-status"><strong>Health Status:</strong> {healthData.status}</p>
                <p data-testid="uptime"><strong>Uptime:</strong> {Math.floor(healthData.uptime)}s</p>
              </>
            )}
          </div>
        </div>
      )}

      {apiStatus === 'error' && (
        <div 
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          data-testid="error-message"
        >
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Connection Failed</h3>
          <p className="text-sm text-red-700 dark:text-red-300" data-testid="error-text">{error}</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            Trying to connect to: {ApiService.getBaseUrl()}
          </p>
        </div>
      )}
    </div>
  )
}