import { useState, useEffect } from 'react'



export const useAppState = () => {
  const [properties, setProperties] = useState([])
  const [results, setResults] = useState([])

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('results'))
    const properties = JSON.parse(localStorage.getItem('properties'))
    if (properties?.length > 0) {
      setProperties(properties)
    }
    if (results?.length > 0) {
      setResults(results)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results))

    localStorage.setItem('properties', JSON.stringify(properties))
  }, [results, properties])

  return { properties, setProperties, results, setResults }
}
