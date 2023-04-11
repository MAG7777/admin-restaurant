import React from 'react';
import ReactMaskedInput from 'react-maskedinput';

interface IMaskedInputProps {
  value: string;
  name: string;
  mask: string;
  placeholder: string;
  addonBefore?: string;
  onChange: (value: any) => void;
}

export const MaskedInput: React.FC<IMaskedInputProps> = React.forwardRef(
  ({ value, name, mask, placeholder, onChange, addonBefore }, ref: any) => (
    <div className='ant-col ant-form-item-control'>
      <div className='ant-form-item-control-input'>
        <div className='ant-input-wrapper ant-input-group'>
          {addonBefore && <div className='ant-input-group-addon'>+7</div>}
          <ReactMaskedInput
            ref={ref}
            name={name}
            value={value}
            className='ant-input'
            mask={mask}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete='chrome-off'
            type='text'
          />
        </div>
      </div>
    </div>
  )
);

MaskedInput.displayName = 'MaskedInput';
