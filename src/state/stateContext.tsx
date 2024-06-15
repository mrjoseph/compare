// context/StateContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

// Define the type for your state
interface State {
  [key: string]: any
}

// Define the type for the context value
interface StateContextType {
  state: State[]
  setState: (newState: State[]) => void
}

// Create the context with a default value
const StateContext = createContext<StateContextType | undefined>({
  state: [],
  setState: () => {},
})

interface StateProviderProps {
  children: ReactNode
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, setState] = useState<State[]>([])

  const setGlobalState = (newState: State[]) => {
    setState([...newState])
  }

  const getGlobalState = () => {
    return JSON.parse(localStorage.getItem('results') || '[]') || []
  }

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('results') || '[]') || []

    localStorage.setItem('results', JSON.stringify([...results, ...state]))
  }, [state])
  return (
    <StateContext.Provider
      value={{ state: getGlobalState, setState: setGlobalState }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider')
  }
  return context
}
