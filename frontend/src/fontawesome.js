// src/fontawesome.js (or src/utils/fontawesome.js)
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStar as fasStar, // Solid star
  faStarHalfAlt,     // Half star
  faCoffee,          // Example: another solid icon
} from '@fortawesome/free-solid-svg-icons';
import {
  faStar as farStar, // Regular (outlined) star
  faHeart,           // Example: another regular icon
} from '@fortawesome/free-regular-svg-icons';
import {
  faTwitter,         // Example: brand icon
} from '@fortawesome/free-brands-svg-icons';

// Add the imported icons to the library
library.add(fasStar, faStarHalfAlt, faCoffee, farStar, faHeart, faTwitter);