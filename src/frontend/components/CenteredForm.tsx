import FullscreenForm, { FullscreenFormProps } from './FullscreenForm';

export default function CenteredForm(props: FullscreenFormProps) {
    return (
        <FullscreenForm name={props.name}>
            <div className='centered'>
                {props.children}
            </div>
        </FullscreenForm>
    );
}