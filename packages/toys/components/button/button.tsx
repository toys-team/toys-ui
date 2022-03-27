import React from 'react';

interface IProps {
  [key: string]: any;
}

const Button: React.FC<IProps> = props => {
  return <div>这是一个button</div>;
};

export default Button;
