export const getFormatDate = (d: Date) => {
  const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  const dformat =
    [d.getFullYear(), padL(d.getMonth() + 1), padL(d.getDate())].join("/");
  return dformat;
};

export const getFormatDateTime = (d: Date) => {
    const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
  
    const dformat =
      [d.getFullYear(), padL(d.getMonth() + 1), padL(d.getDate())].join("/") +
      " " +
      [padL(d.getHours()), padL(d.getMinutes()), padL(d.getSeconds())].join(":");
    return dformat;
  };
