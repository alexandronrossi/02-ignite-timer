import { createContext, ReactNode, useReducer, useState } from 'react'

import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles'

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
		dispatch({
			type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
			payload: {
				activeCycleId,
			},
		})
	}

	function createNewCycle(data: CreateCycleFormData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		dispatch({
			type: ActionTypes.ADD_NEW_CYCLE,
			payload: {
				newCycle,
			},
		})

		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		dispatch({
			type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
			payload: {
				activeCycleId,
			},
		})
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
