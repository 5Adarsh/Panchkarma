// Dosha calculation and utilities

// Calculate dosha percentages (simplified scoring)
function calculateDosha(vataScore, pittaScore, kaphaScore) {
  const total = vataScore + pittaScore + kaphaScore;

  return {
    vata: Math.round((vataScore / total) * 100),
    pitta: Math.round((pittaScore / total) * 100),
    kapha: Math.round((kaphaScore / total) * 100),
  };
}

// Get dominant dosha
function getDominantDosha(vata, pitta, kapha) {
  const doshas = { vata, pitta, kapha };
  return Object.keys(doshas).reduce((a, b) => (doshas[a] > doshas[b] ? a : b)).toUpperCase();
}

// Get dosha recommendations based on balance
function getDoshaRecommendations(dominantDosha) {
  const recommendations = {
    VATA: {
      color: '#667eea',
      element: 'Air & Ether',
      symptoms: 'Dry skin, anxiety, irregular digestion',
      recommendations: [
        'Warm, grounding foods',
        'Regular daily routine',
        'Adequate rest and warmth',
        'Oil massage (Abhyanga)',
        'Meditation for grounding',
      ],
    },
    PITTA: {
      color: '#ff6b6b',
      element: 'Fire & Water',
      symptoms: 'Excessive heat, inflammation, irritability',
      recommendations: [
        'Cooling foods and spices',
        'Moderation in exercise',
        'Avoid excessive sun/heat',
        'Meditation and yoga',
        'Herbal cooling treatments',
      ],
    },
    KAPHA: {
      color: '#51cf66',
      element: 'Earth & Water',
      symptoms: 'Heaviness, sluggishness, weight gain',
      recommendations: [
        'Light, dry, warm foods',
        'Regular vigorous exercise',
        'Stimulating massage',
        'Mental stimulation',
        'Reduced sleep',
      ],
    },
  };

  return recommendations[dominantDosha] || recommendations.VATA;
}

// Get therapies for specific dosha
function getTherapiesForDosha(dosha) {
  const therapyMap = {
    VATA: ['Abhyanga', 'Basti', 'Shirodhara'],
    PITTA: ['Shirodhara', 'Nasya', 'Consultation'],
    KAPHA: ['Vamana', 'Virechana', 'Abhyanga'],
  };

  return therapyMap[dosha] || [];
}

module.exports = {
  calculateDosha,
  getDominantDosha,
  getDoshaRecommendations,
  getTherapiesForDosha,
};
