import { createContext, ReactNode, useReducer, useState } from 'react'

import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
	addNewCycleAction,
	interruptCurrentCycleAction,
	markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateCycleFormData {
	task: string
	minutesAmount: number
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsAmountPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleFormData) => void
	interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
	children: ReactNode
}

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

	const [cyclesState, dispatch] = useReducer(cyclesReducer, {
		cycles: [],
		activeCycleId: null,
	})

	const { cycles, activeCycleId } = cyclesState

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	function setSecondsAmountPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsFinished() {
		dispatch(markCurrentCycleAsFinishedAction())
	}

	function createNewCycle(data: CreateCycleFormData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		dispatch(addNewCycleAction(newCycle))
		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		dispatch(interruptCurrentCycleAction())
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPassed,
				setSecondsAmountPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
