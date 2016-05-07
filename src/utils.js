const isDevMode = false; //typeof module !== 'undefined' && !!module.exports;
export const debug = !isDevMode ? printErr : console.log;
export const nextAction = !isDevMode ? print : console.error;
