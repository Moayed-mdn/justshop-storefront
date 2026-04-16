// composables/useAppToast.ts
export const useAppToast = () => {
  const toast = useToast()

  const showSuccessToast = (message: string) => {
    toast.add({
      title: 'Successful',
      description: message,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  };

  const showErrorToast = (message: string) => {
    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
