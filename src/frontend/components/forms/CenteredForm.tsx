import { JSXChildren } from '../../types';

export default function CenteredForm(props: { children: JSXChildren, title?: JSXChildren }) {
    return (
        <div className='centered'>
            <span className='title'>
                {props.title}
            </span>
            <div className='content'>
                {props.children}
            </div>
        </div>
    );
}