import type { AppProps } from 'next/app'
import { StateProvider } from '../state/stateContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  )
}

export default MyApp
