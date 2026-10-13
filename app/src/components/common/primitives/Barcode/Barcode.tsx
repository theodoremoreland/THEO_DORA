// React
import { ReactElement, useEffect, useRef } from 'react';

// Third party
import JsBarcode from 'jsbarcode';

// Styles
import './Barcode.css';

interface Props {
    value: string;
}

const Barcode = ({ value }: Props): ReactElement => {
    const barcodeRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, value, {
                format: 'CODE128',
                displayValue: false,
                height: 20,
                width: 0.7,
                lineColor: '#02df7b',
                background: 'transparent',
            });
        }
    }, [value]);

    return <svg className="Barcode" ref={barcodeRef}></svg>;
};

export default Barcode;
