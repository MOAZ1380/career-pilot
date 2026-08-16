let resetToken: string | null = null;

export const setResetToken = (token: string | null) => {
  resetToken = token;
};

export const getResetToken = () => {
  return resetToken;
};

export const clearResetToken = () => {
  resetToken = null;
};
