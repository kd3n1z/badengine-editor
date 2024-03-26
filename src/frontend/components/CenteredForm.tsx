import 'react'
import FullscreenForm, { FullscreenFormProps } from './FullscreenForm';

export default function CenteredForm(props: FullscreenFormProps) {
    return (
        <FullscreenForm visible={props.visible}>
            <div className='centered'>
                {props.children}
            </div>
        </FullscreenForm>
    );
}