import { InputLabel, Select, styled } from "@mui/material";
import { ReactNode } from "react";

interface SelectProps {
    children: ReactNode;
    onChange: (e: any) => void;
    value: any;
    label: string;
}

const Wrapper = styled('div')({
    display: 'flex', flexDirection: 'column', width: '100%'
});

const LabeledSelect = ({ onChange, value, label, children }: SelectProps) => <Wrapper>
    <InputLabel id={label}>{label}</InputLabel>
    <Select
        id={`${label}id`}
        variant='standard'
        fullWidth
        onChange={onChange}
        value={value}
    >
        {children}
    </Select>
</Wrapper>

export { LabeledSelect };
