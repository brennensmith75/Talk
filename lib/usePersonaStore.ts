import { create } from 'zustand'
import { Persona } from '../constants/personas'

export interface PersonaState {
  personas: Persona[]
  setPersonas: (personas: Persona[]) => void
  persona: Persona | null
  setPersona: (persona: Persona) => void
}

export const usePersonaStore = create<PersonaState>(set => ({
  personas: [],
  setPersonas: (personas: Persona[]) =>
    set((state: any) => ({ personas: personas })),
  persona: null,
  setPersona: (persona: Persona) => set((state: any) => ({ persona: persona }))
}))
