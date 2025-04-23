export function useCalendarNavigation(calendarRef, setMonthName) {
  const handleNavigation = (type) => {
    if (!calendarRef.current) return;

    const calendarInstance = calendarRef.current.getInstance();

    if (type === 'prev') calendarInstance.prev();
    else if (type === 'next') calendarInstance.next();
    else calendarInstance.today();

    const formattedMonth = calendarInstance
      .getDate()
      .toDate()
      .toLocaleString('default', { month: 'long' });

    setMonthName(formattedMonth);
  };

  return { handleNavigation };
}
