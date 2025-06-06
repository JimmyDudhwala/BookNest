'use client'
import BookLoader from '@/lib/BookLoader'
import { persister, store } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate} from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import AuthCheck from '@/store/Provider/AuthProvider'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <Provider store={store}>
        
          <PersistGate loading={<BookLoader />} persistor={persister}>
            <Toaster />
              <AuthCheck>  
                {children}
              </AuthCheck>
          </PersistGate>
    
      </Provider>
    </div>
  )
}