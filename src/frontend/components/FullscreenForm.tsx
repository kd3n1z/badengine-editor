import 'react'
import { JSXChildren } from '../types';

export type FullscreenFormProps = {
    children?: JSXChildren,
    visible?: boolean
};

export default function FullscreenForm(props: FullscreenFormProps) {
    return (
        <div className={'form ' + (props.visible ? '' : 'closed')}>{props.children}</div>
    );
}