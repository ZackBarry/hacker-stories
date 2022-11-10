import React from 'react';

type InputWithLabelProps = {
    id: string;
    type?: string;
    value: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
    children: React.ReactNode;
    searchTerm: string;
};
  
const InputWithLabel = ({ 
    id, 
    type = 'text',
    value, 
    onInputChange, 
    isFocused,
    children,
    searchTerm,
}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null!);
  
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);
  
    return (
        <div className="user-input">
            <label htmlFor={id} className="label">
                {children}
            </label>
            <input
                ref={inputRef}
                id={id} 
                type={type}
                value={value} 
                onChange={onInputChange}
            />
            <button 
                type="submit" 
                disabled={!searchTerm} 
                className="button button_large"
            >
                Submit
            </button>
        </div>
    )
}

export default InputWithLabel;