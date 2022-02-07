exports.generateCSV = async (players, notes, tendencies) => {
  const csv = players.sort().reduce((total, curr) => {
    const currNotes = notes.filter(
      (note) => note.player_name === curr.player_name
    );

    const currTendencies = tendencies.filter(
      (tendency) => tendency.player_name === curr.player_name
    );

    const arrayToString = (arr, type) => {
      return arr.reduce((total, curr, index) => {
        const commaRemoved = curr[type].replaceAll(",", " & ");

        if (index === 0) return commaRemoved;

        return total + ` |-|-| ${commaRemoved}`;
      }, "");
    };

    return (total += `${curr.player_name}, ${curr.type}, ${arrayToString(
      currNotes,
      "note"
    )}, ${arrayToString(currTendencies, "tendency")}\n`);
  }, "player_name,type,notes,tendencies\n");

  return csv;
};
