export const formatMultilineText = (text: string | string[]) => {
  if (Array.isArray(text)) {
    return text.join('\n');
  }
  return text.split(';').join('\n');
};
