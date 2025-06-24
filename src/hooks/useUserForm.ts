import {useState, useEffect} from 'react';
import {User} from './useUserTable';
import {validateUserForm} from '@/utils/validation';

interface UseUserFormProps {
    initialValues?: User;
    isEdit?: boolean;
    onUserCreated?: () => void;
}

export function useUserForm({initialValues, isEdit, onUserCreated}: UseUserFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [email, setEmail] = useState(initialValues?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateFormWithInitialValues = () => {
        if (initialValues) {
            setName(initialValues.name || '');
            setEmail(initialValues.email || '');
        }
    };

    useEffect(updateFormWithInitialValues, [initialValues]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        const validationError = validateUserForm(name, email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEdit && initialValues) {
                response = await fetch('/api/users', {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: initialValues.id, name, email}),
                });
            } else {
                response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, email}),
                });
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save user');
            }

            setSuccess(true);
            if (!isEdit) {
                setName('');
                setEmail('');
            }

            if (onUserCreated) onUserCreated();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Form state
        name,
        setName,
        email,
        setEmail,
        loading,
        error,
        success,

        // Form actions
        handleSubmit,
    };
}