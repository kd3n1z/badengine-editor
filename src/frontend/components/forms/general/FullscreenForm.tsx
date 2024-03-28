import { useContext } from 'react';
import { JSXChildren } from '../../../types';
import { FormContext } from '../../../App';

export type FullscreenFormProps = {
    children?: JSXChildren,
    name: string
};

export default function FullscreenForm(props: FullscreenFormProps) {
    const windowContext = useContext(FormContext);
    return (
        <div className={'form ' + (windowContext.visibleFormName == props.name ? '' : 'closed')} id={"form-" + props.name}>
            {props.children}
        </div>
    );
}