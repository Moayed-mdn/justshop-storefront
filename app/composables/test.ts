export const $api = () => {
    return $fetch.create({
    //  onResponseError({ response }) { const { showErrorToast } = useAppToast() // Extract your specific error path: 
    //  err.data?.data?.message console.log(response._data) const message = response._data?.data?.error || response._data?.data?.message || 'Something went wrong' showErrorToast(message) }
    })
}
