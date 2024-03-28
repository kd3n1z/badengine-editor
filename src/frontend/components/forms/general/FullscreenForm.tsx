import { useContext, useEffect } from 'react';
import { FormNameType, JSXChildren } from '../../../types';
import { FormContext } from '../../../App';

export type FullscreenFormProps = {
    children?: JSXChildren,
    name: FormNameType,
    title: string
};

export default function FullscreenForm(props: FullscreenFormProps) {
    const windowContext = useContext(FormContext);

    useEffect(() => {
        if (windowContext.visibleFormName == props.name) {
            document.title = "badengine - " + props.title;
        }
    }, [windowContext.visibleFormName]);

    return (
        <div
            className={'form ' + (windowContext.visibleFormName == props.name ? '' : 'closed')}
            id={"form-" + props.name}
            style={{
                zIndex: windowContext.visibleFormName == props.name ?
                    100 + windowContext.formStack.length :
                    100
            }}
        >
            {props.children}
        </div>
    );
}