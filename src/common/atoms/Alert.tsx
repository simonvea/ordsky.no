import styled from 'styled-components';

type AlertProps = {
  small?: boolean;
};

export const Alert = styled.div<AlertProps>`
  display: block;
  height: ${(props) => (props.small ? 10 : 40)}px;
  width: ${(props) => (props.small ? 'inherit' : '350px')};
  padding: ${(props) => (props.small ? 0 : 2)}px;
  margin: ${(props) => (props.small ? 0 : 5)}px;
  font-size: ${(props) => (props.small ? '0.8em' : 'inherit')};
  color: red;
`;
