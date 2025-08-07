// frontend/app/lanterns/page.jsx

import React from 'react';
import { getWeeklyColors } from '../components/actions';
import { LanternsClient } from './LanternsClient';

export default async function LanternsPage() {
  const colors = await getWeeklyColors();
  
  return <LanternsClient colors={colors} />;
}