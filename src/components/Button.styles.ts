import styled, { css } from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
	variant: ButtonVariant;
}

const buttonVariant = {
	primary: 'purple',
	secondary: 'purple',
	danger: 'purple',
	success: 'purple'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
	background-color: ${props => props.theme["gray-500"]};
	color: ${props => props.theme.white};
`
