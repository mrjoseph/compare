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
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}

// Create the context with a default value
const StateContext = createContext<StateContextType | undefined>({
  state: {},
  setState: () => {},
})

interface StateProviderProps {
  children: ReactNode
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, setState] = useState<State>({ results: [] })



  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('results') || '[]') || []
    // check the ids of the results and only add the new ones
    const newResults = state.results.filter(
      (result: any) => !results.some((r: any) => r.id === result.id),
    )
    localStorage.setItem('results', JSON.stringify([...results, ...newResults]))
    
  }, [state.results])
  return (
    <StateContext.Provider value={{ state, setState }}>
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
