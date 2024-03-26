import { useContext } from 'react';
import { JSXChildren } from '../types';
import { WindowContext } from '../App';

export type FullscreenFormProps = {
    children?: JSXChildren,
    name: string
};

export default function FullscreenForm(props: FullscreenFormProps) {
    const windowContext = useContext(WindowContext);

    return (
        <div className={'window ' + (windowContext.visibleWindowName == props.name ? '' : 'closed')}>{props.children}</div>
    );
}