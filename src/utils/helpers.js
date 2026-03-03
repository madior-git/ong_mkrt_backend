// Formater une date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Tronquer un texte
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Slugifier un titre
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Valider une URL d'image
const isValidImageUrl = (url) => {
  const pattern = /\.(jpg|jpeg|png|gif|webp)$/i;
  return pattern.test(url);
};

module.exports = {
  formatDate,
  truncateText,
  slugify,
  isValidImageUrl
};