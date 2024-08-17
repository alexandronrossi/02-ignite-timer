import { createContext, ReactNode, useReducer, useState } from 'react'

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

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
	const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
		if (action.type === 'ADD_NEW_CYCLE') {
			return [...state, action.payload.newCycle]
		}
		return state
	}, [])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	function setSecondsAmountPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsFinished() {
		dispatch({
			type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
			payload: {
				activeCycleId,
			},
		})
		// setCycles((state) =>
		// 	state.map((cycle) => {
		// 		return cycle.id === activeCycleId
		// 			? { ...cycle, finishedDate: new Date() }
		// 			: cycle
		// 	}),
		// )
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
			type: 'ADD_NEW_CYCLE',
			payload: {
				newCycle,
			},
		})
		// setCycles((state) => [...state, newCycle])
		setActiveCycleId(id)
		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		dispatch({
			type: 'INTERRUPT_CURRENT_CYCLE',
			payload: {
				activeCycleId,
			},
		})

		// setCycles((state) =>
		// 	state.map((cycle) => {
		// 		return cycle.id === activeCycleId
		// 			? { ...cycle, interruptedDate: new Date() }
		// 			: cycle
		// 	}),
		// )

		setActiveCycleId(null)
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
