import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSXChildren } from '../../../types';
import FullscreenForm, { FullscreenFormProps } from './FullscreenForm';
import { FormContext } from '../../../App';
import { useContext } from 'react';

export default function CenteredForm(props: FullscreenFormProps & { titleElement?: JSXChildren, cornerInfo?: JSXChildren, showCloseButton?: boolean }) {
    const windowContext = useContext(FormContext);

    return (
        <FullscreenForm name={props.name} title={props.title}>
            <div className='centered'>
                {props.titleElement != null ? <span className='title'>
                    {props.titleElement}
                </span> : ""}
                <div className='content'>
                    {props.children}
                </div>
            </div>
            <>
                {props.cornerInfo != null ? <span className='corner-info'>{props.cornerInfo}</span> : ""}
            </>
            <>
                {props.showCloseButton ? <FontAwesomeIcon className='close-button' onClick={windowContext.closeLastForm} icon='arrow-left-long' /> : ""}
            </>
        </FullscreenForm >
    );
}