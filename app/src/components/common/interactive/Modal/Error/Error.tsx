import { ReactElement } from 'react';

import Modal from '../Modal';

interface Props {
    handleClose: () => void;
}

const Error = ({ handleClose }: Props): ReactElement => {
    return (
        <Modal title="Something went wrong" handleClose={handleClose}>
            <p>
                There was an issue loading projects from GitHub. As a result,
                backup data will be used instead. The information that you see
                may be outdated and some features may not work as intended.
            </p>
        </Modal>
    );
};

export default Error;
