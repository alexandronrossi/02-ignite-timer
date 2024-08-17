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

interface CyclesState {
	cycles: Cycle[]
	activeCycleId: string | null
}

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

	const [cyclesState, dispatch] = useReducer(
		(state: CyclesState, action: any) => {
			switch (action.type) {
				case 'ADD_NEW_CYCLE':
					return {
						...state,
						cycles: [...state.cycles, action.payload.newCycle],
						activeCycleId: action.payload.newCycle.id,
					}

				case 'INTERRUPT_CURRENT_CYCLE':
					return {
						...state,
						cycles: state.cycles.map((cycle) => {
							return cycle.id === action.payload.activeCycleId
								? { ...cycle, interruptedDate: new Date() }
								: cycle
						}),
						activeCycleId: null,
					}

				case 'MARK_CURRENT_CYCLE_AS_FINISHED':
					return {
						...state,
						cycles: state.cycles.map((cycle) => {
							return cycle.id === action.payload.activeCycleId
								? { ...cycle, finishedDate: new Date() }
								: cycle
						}),
					}
				default:
					return state
			}
		},
		{
			cycles: [],
			activeCycleId: null,
		},
	)

	const { cycles, activeCycleId } = cyclesState

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

		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		dispatch({
			type: 'INTERRUPT_CURRENT_CYCLE',
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
