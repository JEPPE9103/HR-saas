export function suggestGenderMapping(distinct: string[]): Record<string, "male" | "female" | "other" | "prefer_not_to_say"> {
  const mapping: Record<string, "male" | "female" | "other" | "prefer_not_to_say"> = {};
  
  distinct.forEach(value => {
    const lowerValue = value.toLowerCase().trim();
    
    if (/^f(emale)?|kvinna|k|f|kvinnlig|woman|w$/i.test(lowerValue)) {
      mapping[value] = 'female';
    } else if (/^m(ale)?|man|m|manlig|man|m$/i.test(lowerValue)) {
      mapping[value] = 'male';
    } else if (/^o(ther)?|annan|annat|diverse|d|3|övrigt$/i.test(lowerValue)) {
      mapping[value] = 'other';
    } else if (lowerValue === '' || lowerValue === 'null' || lowerValue === 'undefined' || 
               lowerValue === 'n/a' || lowerValue === 'na' || lowerValue === '0' ||
               lowerValue === 'okänt' || lowerValue === 'unknown') {
      mapping[value] = 'prefer_not_to_say';
    } else {
      mapping[value] = 'other';
    }
  });
  
  return mapping;
}
