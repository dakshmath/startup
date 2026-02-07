'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Idea, Analysis } from '@/types'

interface IdeaState {
  ideas: Idea[]
  currentIdea: Idea | null
  currentAnalysis: Analysis | null
  loading: boolean
  error: string | null
}

type IdeaAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_IDEAS'; payload: Idea[] }
  | { type: 'ADD_IDEA'; payload: Idea }
  | { type: 'UPDATE_IDEA'; payload: Idea }
  | { type: 'DELETE_IDEA'; payload: number }
  | { type: 'SET_CURRENT_IDEA'; payload: Idea | null }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: Analysis | null }
  | { type: 'UPDATE_ANALYSIS'; payload: Analysis }

const initialState: IdeaState = {
  ideas: [],
  currentIdea: null,
  currentAnalysis: null,
  loading: false,
  error: null,
}

function ideaReducer(state: IdeaState, action: IdeaAction): IdeaState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_IDEAS':
      return { ...state, ideas: action.payload, loading: false }
    case 'ADD_IDEA':
      return { ...state, ideas: [action.payload, ...state.ideas] }
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.id === action.payload.id ? action.payload : idea
        ),
        currentIdea: state.currentIdea?.id === action.payload.id ? action.payload : state.currentIdea,
      }
    case 'DELETE_IDEA':
      return {
        ...state,
        ideas: state.ideas.filter(idea => idea.id !== action.payload),
        currentIdea: state.currentIdea?.id === action.payload ? null : state.currentIdea,
        currentAnalysis: state.currentAnalysis?.idea_id === action.payload ? null : state.currentAnalysis,
      }
    case 'SET_CURRENT_IDEA':
      return { ...state, currentIdea: action.payload }
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload }
    case 'UPDATE_ANALYSIS':
      return { ...state, currentAnalysis: action.payload }
    default:
      return state
  }
}

interface IdeaContextType {
  state: IdeaState
  dispatch: React.Dispatch<IdeaAction>
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined)

export function IdeaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ideaReducer, initialState)

  return (
    <IdeaContext.Provider value={{ state, dispatch }}>
      {children}
    </IdeaContext.Provider>
  )
}

export function useIdea() {
  const context = useContext(IdeaContext)
  if (context === undefined) {
    throw new Error('useIdea must be used within an IdeaProvider')
  }
  return context
}
