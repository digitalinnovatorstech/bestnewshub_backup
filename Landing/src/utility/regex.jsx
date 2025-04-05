// export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const emailRegex = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{2,253}\.(com|in)$/;
export const phoneNumberRegex = /^[6-9]\d{9}$/;
export const aadharRegx = /^\d{4}\s\d{4}\s\d{4}$/;
export const postalCodeRegex = /^[1-9][0-9]{5}$/;
export const urlPattern =
  /^(https?:\/\/)?(www\.)?(facebook|twitter|x|instagram|linkedin|youtube|in\.pinterest|pinterest|whatsapp|snapchat|reddit|telegram|github)\.(com|tv|co|org|me)(\/[a-zA-Z0-9._-]+)*\/?(\?[a-zA-Z0-9%&=_-]+)*$/;
