import React from 'react';
import {IconButton, Tooltip} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';

interface ActionButton {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
}

interface ActionButtonsProps {
    buttons: ActionButton[];
    size?: 'small' | 'medium' | 'large';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
                                                         buttons,
                                                         size = 'small',
                                                     }) => {
    return (
        <>
            {buttons.map((button, index) => (
                <Tooltip key={index} title={button.tooltip || ''} arrow>
                    <span>
                        <IconButton
                            size={size}
                            onClick={button.onClick}
                            color={button.color}
                            disabled={button.disabled}
                        >
                            {button.icon}
                        </IconButton>
                    </span>
                </Tooltip>
            ))}
        </>
    );
};

export const createEditButton = (onClick: () => void, tooltip: string = 'Edit'): ActionButton => ({
    icon: <EditIcon/>,
    onClick,
    tooltip,
});

export const createDeleteButton = (onClick: () => void, tooltip: string = 'Delete'): ActionButton => ({
    icon: <DeleteIcon/>,
    onClick,
    tooltip,
    color: 'error',
});

export const createCourseButton = (onClick: () => void, tooltip: string = 'Manage Courses'): ActionButton => ({
    icon: <SchoolIcon/>,
    onClick,
    tooltip,
});

export default ActionButtons;