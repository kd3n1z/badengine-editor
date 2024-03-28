import { JSXChildren } from '../../../types';
import FullscreenForm, { FullscreenFormProps } from './FullscreenForm';

export default function CenteredForm(props: FullscreenFormProps & { title?: JSXChildren, cornerInfo?: JSXChildren }) {
    return (
        <FullscreenForm name={props.name}>
            <div className='centered'>
                {props.title != null ? <span className='title'>
                    {props.title}
                </span> : ""}
                <div className='content'>
                    {props.children}
                </div>
            </div>
            <>
                {props.cornerInfo != null ? <span className='corner-info'>
                    {props.cornerInfo}
                </span> : ""}
            </>
        </FullscreenForm>
    );
}