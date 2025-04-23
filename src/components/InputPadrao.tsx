import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const InputPadrao: React.FC<Props> = ({ label, ...props }) => (
    <div className="mb-3">
        {label && <label className="form-label fw-semibold">{label}</label>}
        <input className="form-control rounded-3" {...props} />
    </div>
);

export default InputPadrao;
