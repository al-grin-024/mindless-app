/**
 * Mindless — Calendario de Vacunación Infantil de la Comunidad de Madrid (2024)
 * Official vaccination schedule for children in Madrid.
 */

export const vaccinationSchedule = [
  {
    ageMonths: 2,
    vaccines: [
      { name: 'Hexavalente (DTPa-VPI-Hib-HB)', dose: 1 },
      { name: 'Neumococo', dose: 1 },
      { name: 'Rotavirus', dose: 1, optional: true }
    ]
  },
  {
    ageMonths: 4,
    vaccines: [
      { name: 'Hexavalente (DTPa-VPI-Hib-HB)', dose: 2 },
      { name: 'Neumococo', dose: 2 },
      { name: 'Meningococo B', dose: 1 },
      { name: 'Rotavirus', dose: 2, optional: true }
    ]
  },
  {
    ageMonths: 11,
    vaccines: [
      { name: 'Hexavalente (DTPa-VPI-Hib-HB)', dose: 3 },
      { name: 'Neumococo', dose: 3 }
    ]
  },
  {
    ageMonths: 12,
    vaccines: [
      { name: 'Triple Vírica (SRP)', dose: 1 },
      { name: 'Meningococo ACWY', dose: 1 },
      { name: 'Meningococo B', dose: 2 }
    ]
  },
  {
    ageMonths: 15,
    vaccines: [
      { name: 'Varicela', dose: 1 }
    ]
  },
  {
    ageMonths: 48, // 4 years
    vaccines: [
      { name: 'Triple Vírica (SRP)', dose: 2 },
      { name: 'Varicela', dose: 2 }
    ]
  },
  {
    ageMonths: 72, // 6 years
    vaccines: [
      { name: 'DTPa-VPI', dose: 1 } // Refuerzo
    ]
  },
  {
    ageMonths: 144, // 12 years
    vaccines: [
      { name: 'Meningococo ACWY', dose: 1 }, // Rescate
      { name: 'Virus Papiloma Humano (VPH)', dose: 1 } // Niños y niñas
    ]
  },
  {
    ageMonths: 168, // 14 years
    vaccines: [
      { name: 'Td (Tétanos, difteria)', dose: 1 } // Refuerzo
    ]
  }
];

/**
 * Get upcoming vaccines based on birthdate
 * @param {Date|number} birthDate - Child's birth date
 * @returns {Array} List of upcoming vaccines with calculated dates
 */
export function getUpcomingVaccines(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  
  // Calculate current age in months
  let ageMonths = (now.getFullYear() - birth.getFullYear()) * 12;
  ageMonths -= birth.getMonth();
  ageMonths += now.getMonth();
  
  const upcoming = [];
  
  for (const schedule of vaccinationSchedule) {
    if (schedule.ageMonths >= ageMonths) {
      // Calculate target date
      const targetDate = new Date(birth);
      targetDate.setMonth(targetDate.getMonth() + schedule.ageMonths);
      
      // We only want vaccines in the future
      if (targetDate > now) {
        upcoming.push({
          targetDate: targetDate.getTime(),
          ageLabel: schedule.ageMonths >= 12 ? `${schedule.ageMonths / 12} years` : `${schedule.ageMonths} months`,
          vaccines: schedule.vaccines
        });
      }
    }
  }
  
  return upcoming;
}
