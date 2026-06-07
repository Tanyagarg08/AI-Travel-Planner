import dotenv from 'dotenv';
dotenv.config();

import { fetchHotelImage } from './services/pexelsService.js';

const img1 = await fetchHotelImage('Hotel Pitrashish', 'Delhi', 'Budget Pick', process.env.PEXELS_API_KEY);
const img2 = await fetchHotelImage('The Park New Delhi', 'Delhi', 'Best Value', process.env.PEXELS_API_KEY);
const img3 = await fetchHotelImage('The Oberoi New Delhi', 'Delhi', 'Luxury', process.env.PEXELS_API_KEY);

console.log('img1:', img1);
console.log('img2:', img2);
console.log('img3:', img3);