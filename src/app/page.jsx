// frontend/src/app/page.jsx

'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Questionnaire } from './components/Questionnaire';
import { saveMood } from './components/actions';

const initialState = {
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="submit-button">
      {pending ? '送信中...' : '回答を完了してランタンを見る'}
    </button>
  );
}

export default function QuestionnairePage() {
  const [state, formAction] = useFormState(saveMood, initialState);

  return (
    <form action={formAction}>
      <Questionnaire />
      <SubmitButton />
      {state?.message && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}