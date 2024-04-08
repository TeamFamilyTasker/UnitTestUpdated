const CalendarEvent = ({ event }) => {
  const { title, user } = event;

  // Check if user and user.family exist, and if the family members array is not empty
  const familyMembers = user && user.family && user.family.members ? user.family.members : [];

  return (
    <div>
    <strong>{title}</strong>
    <span>
      {/* Simplify rendering of family members with join */}
      {familyMembers.map(member => member.familyId).join(', ')}
    </span>
  </div>
);
};

export default CalendarEvent;
