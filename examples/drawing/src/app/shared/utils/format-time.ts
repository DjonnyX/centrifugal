export const formatTime = (dateTime: number, locale: string = 'en-GB') => {
    if (dateTime) {
        return Intl.DateTimeFormat(locale, {
            timeStyle: 'short',
        }).format(dateTime);
    }
    return '';
};